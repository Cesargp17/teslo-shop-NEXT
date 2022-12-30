import { connect, disconnect } from "../../../database/db";
import Product from "../../../models/Product";

export default function (req, res) {

    switch (req.method) {
        case 'GET':
            return getProductsBySlug( req, res );
    
        default:
            return res.status(400).json({
                message: 'Bad request'
            });
    }
}

const getProductsBySlug = async( req, res ) => {

    const { slug } = req.query;
        
    await connect();
    const product = await Product.findOne({ slug }).select().lean();
    await disconnect();

    if ( !product ){
        return res.status(400).json({ msg: 'Producto no encontrado' });
    }

    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    }) 

    return res.status(200).json( product );
}