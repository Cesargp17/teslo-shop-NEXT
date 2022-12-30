import { connect, disconnect } from "../database/db"
import Order from "../models/Order";

export const getOrderById = async( id ) => {
    await connect();
    const order = await Order.findById( id );
    await disconnect();

    return order;
}