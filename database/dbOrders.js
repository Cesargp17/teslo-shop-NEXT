import { isValidObjectId } from "mongoose"
import Order from "../models/Order";
import { connect, disconnect } from "./db";

export const getOrderById = async( id ) => {
    if( !isValidObjectId(id) ) return null;

    await connect();
    const order = await Order.findById(id).lean();
    await disconnect();

    if( !order ) return null;

    return JSON.parse(JSON.stringify( order ));
}

export const getOrdersByUser = async( userId ) => {
    if( !isValidObjectId(userId) ) return [];

    await connect();
    const orders = await Order.find({ user: userId }).lean();
    await disconnect();

    return JSON.parse(JSON.stringify( orders ));
}