import Product from "../models/Product";
import { connect, disconnect } from "./db"

export const getProductBySlug = async(slug) => {

    await connect();
    const product = await Product.findOne({ slug }).lean();
    await disconnect();

    if( !product ) return null;

    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    }) 

    return JSON.parse( JSON.stringify( product ) );
}

export const getAllProductSlugs = async() => {
    await connect();
    const slugs = await Product.find().select('slug -_id').lean();
    await disconnect();

    return slugs;
}

export const getProductsByTerm = async( term ) => {
    term = term.toString().toLowerCase();

    await connect();
    const products = await Product.find({
       $text: { $search: term } 
    }).select('title images price inStock slug -_id').lean();
    await disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });
        return product;
    });

    return updatedProducts;
}

export const getAllProducts = async() => {
    await connect();
    // const products = Product.find().select().lean();
    const products = await getProductsByTerm('shirt');
    await disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });
        return product;
    });

    return JSON.parse( JSON.stringify(updatedProducts) );
}