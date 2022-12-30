import { connect, disconnect } from "../../../database/db";
import Order from "../../../models/Order";

export default function (req, res) {

    switch (req.method) {
        case 'GET':
           return getOrders( req, res );
    
        default:
            return res.status(200).json({ msg: 'Bad Request' })
    }
}

    const getOrders = async( req, res ) => {
        
        await connect();
        const orders = await Order.find().sort({ createdAt: 'desc' }).populate('user', 'name email').lean();
        await disconnect();

        return res.status(200).json( orders )
    }