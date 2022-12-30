import axios from "axios";
import { connect, disconnect } from "../../../database/db";
import Order from "../../../models/Order";

export default function (req, res) {

    switch (req.method) {
        case 'POST':
            return payOrder( req, res );
    
        default:
            return res.status(400).json({ msg: 'Bad request' });
    }
}

const getPayPalBearerToken = async() => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64')

    const body = new URLSearchParams('grant_type=client_credentials')

    try {
        
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (error) {
        if( axios.isAxiosError(error) ){
            console.log(error.response?.data);
        } else {
            console.log(error)
        }
    }
}

const payOrder = async( req, res ) => {

    const paypalBearerToken = await getPayPalBearerToken();

    if( !paypalBearerToken ){
        return res.status(400).json({ msg: 'No se pudo confirmar el token de PayPal' });
    }

    const { transactionId = '', orderId = '' } = req.body;

    const { data } = await axios.get( `${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`,{
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    });

    if( data.status !== 'COMPLETED' ){
        return res.status(401).json({ msg: 'Orden no reconocida' });
    }

    await connect();

    const dbOrder = await Order.findById( orderId );

    if( !dbOrder ){
        await disconnect();
        return res.status(400).json({ msg: 'La orden no existe' });
    }

    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await disconnect();
        return res.status(400).json({ msg: 'Los montos de paypal y nuestra orden no son iguales' });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    dbOrder.save();
    await disconnect();

    return res.status(200).json({ msg: 'Orden pagada' });
}