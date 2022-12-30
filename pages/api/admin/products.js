import { isValidObjectId } from "mongoose";
import { connect, disconnect } from "../../../database/db";
import Product from "../../../models/Product";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL)

export default function (req, res) {
    
    switch (req.method) {

        case 'GET':
            return getProducts( req, res );

        case 'POST':
            return createProduct( req, res );
            
        case 'PUT':
            return updateProduct( req, res );    

        default:
            return res.status(200).json({ msg: 'Bad Request' });
    }

}

const getProducts = async( req, res ) => {

    await connect();
    const products = await Product.find().sort({ title: 'asc' }).lean();
    await disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });
        return product;
    });

    res.status(200).json( updatedProducts );
}

const updateProduct = async( req, res ) => {

    const { _id = '', images = [] } = req.body;

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ msg: 'El ID del producto no es valido' });
    }

    if( images.length < 2 ){
        return res.status(400).json({ msg: 'Es necesario almenos 2 imagenes' });
    }

    try {
        await connect();
        const product = await Product.findById(_id);

        if( !product ) {
            await disconnect();
            return res.status(400).json({ msg: 'No existe un producto con ese ID' });
        }

        product.images.forEach( async( image ) => {
            if( !images.includes( image ) ){
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1).split('.');
                await cloudinary.uploader.destroy( fileId );
            }
        })

        await product.update( req.body );
        await product.save();
        await disconnect();

        return res.status(200).json( product );

    } catch (error) {
        console.log(error)
        await disconnect();
        return res.status(400).json({ msg: 'Revisar consola del servidor' });
    }

}

const createProduct = async( req, res ) => {

    const { images = [] } = req.body;

    if( images.length < 2 ){
        return res.status(400).json({ msg: 'Es necesario almenos 2 imagenes' });
    }

    try {
        await connect();
        const productInDB = await Product.findOne({ slug: req.body.slug });
        if( productInDB ) {
            await disconnect();
            return res.status(400).json({ msg: 'El producto ya existe' });
        }
        const producto = new Product( req.body );
        await producto.save();
        await disconnect();

        return res.status(201).json( producto );
    } catch (error) {
        console.log(error)
        await disconnect();
        return res.status(400).json({ msg: 'Revisar logs del servidor' });
    }

}