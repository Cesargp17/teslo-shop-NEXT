import { isValidToken } from "../../../utils/jwt";
import jwt_decode from "jwt-decode";
import { connect, disconnect } from "../../../database/db";
import Product from "../../../models/Product";
import Order from "../../../models/Order";

export default function (req, res) {

    switch (req.method) {
        case 'POST':
           return createOrder( req, res );
    
        default:
            return res.status(400).json({ msg: 'Bad Request' })
    }
}

const createOrder = async( req, res ) => {

    const{ orderItems, total } = req.body;

    const session = await isValidToken( req.cookies.token );
    let decoded = jwt_decode( req.cookies.token );

    if( !session ){
        return res.status(401).json({ msg: 'Debe estar autenticado para hacer esto.' })
    }

    const productsIds = orderItems.map( product => product._id );

    await connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });
    
    try {
        const subTotal = orderItems.reduce( ( prev, current ) => {
            
            const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
            if( !currentPrice ){
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }
            return ( currentPrice * current.quantity ) + prev}, 0 );

            const impuestos = subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
            const backendTotal = subTotal + impuestos;

            if( total !== backendTotal ){
                throw new Error('El total no cuadra con el monto');
            }

            for( let i = 0; i <= orderItems.length; i++ ){
                if( orderItems[i] === undefined ){
                    break;
                }

                const newProductStock = await Product.findById( orderItems[i]._id );

                if( newProductStock.inStock < orderItems[i].quantity ){
                    console.log('no stock')
                    return res.status(400).json({ msg: 'Algun producto se encuentra agotado o no hay suficiente stock, revise de nuevo' });
                }

                newProductStock.inStock = newProductStock.inStock - orderItems[i].quantity;
                await newProductStock.save();

            }

            const userId = decoded._id;
            const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
            newOrder.total = Math.round( newOrder.total * 100 )/100;
            await newOrder.save();
            return res.status(200).json( newOrder );


    } catch (error) {
        await disconnect();
        console.log(error);
        return res.status(400).json({ msg: 'Revise los logs del servidor' });
    }
}