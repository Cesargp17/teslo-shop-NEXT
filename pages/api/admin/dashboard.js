import { connect, disconnect } from "../../../database/db"
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import User from "../../../models/User";
import jwt_decode from "jwt-decode"

export default function (req, res) {

    switch ( req.method ) {
        case 'GET':
            return getDashboardInformation( req, res )
    
        default:
            return res.status(400).json({ msg: 'Bad Request' })
    }

}

const getDashboardInformation = async( req, res ) => {

    const token = req.cookies.token;
    const user = jwt_decode(token);

    if( !token ){
        return res.status(401).json({ msg: 'Debe estar autenticado' });
    }

    if( user.role !== 'admin' ){
        return res.status(401).json({ msg: 'No autorizado' });
    }

    await connect();

        const [ Orders, Users, Products ] = await Promise.all([
            Order.find().lean(),
            User.find().lean(),
            Product.find().lean(),
        ])

    await disconnect();

    const numberOfOrders = Orders.length;
    const paidOrders = Orders.filter( order => order.isPaid === true ).length;
    const notPaidOrders = Orders.filter( order => order.isPaid === false ).length;
    const numberOfClients = Users.filter( user => user.role === 'client' ).length;
    const numberOfProducts = Products.length;
    const productsWithNoInventory = Products.filter( product => product.inStock === 0 ).length;
    const productsWithLowInventory = Products.filter( product => product.inStock <= 10 ).length;

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        productsWithLowInventory,
    })
}