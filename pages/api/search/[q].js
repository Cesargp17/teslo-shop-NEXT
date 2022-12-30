import { connect, disconnect } from "../../../database/db";
import Product from "../../../models/Product";

export default function (req, res) {

    switch (req.method) {
        case 'GET':
            return searchProducts( req, res );
    
        default:
            return res.status(400).json({ msg: 'Bad request' });
    }
}

const searchProducts = async(req, res) => {
    let { q = '' } = req.query;

    if( q.length === 0 ){
        return res.status(400).json({ msg: 'Debe especificar el query de busqueda' });
    }

    q = q.toString().toLowerCase();

    await connect();
    const products = await Product.find({
       $text: { $search: q } 
    }).select('title images price inStock slug -_id').lean();
    await disconnect();

    return res.status(200).json( products );
}