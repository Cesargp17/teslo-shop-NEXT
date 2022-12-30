import { SHOP_CONSTANTS } from "../../../database/constants";
import { connect, disconnect } from "../../../database/db";
import Product from "../../../models/Product";

export default function (req, res) {

    switch( req.method ){
        case 'GET':
            return getProducts( req, res )
        
        default: 
            return res.status(400).json({ msg: 'Bad request' });
    }
}

const getProducts = async( req, res ) => {

    const { gender = 'all' } = req.query;
    let condition = {};

    if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(gender) ){
        condition = { gender };
    }
        
    await connect();
    const products = await Product.find(condition).select('title images price inStock slug -_id').lean();
    await disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });
        return product;
    });

    return res.status(200).json( updatedProducts );
}