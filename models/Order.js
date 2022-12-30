import moongose, { Schema, model, Model } from 'mongoose';

const orderSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        gender: { type: String, required: true },
    }],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        firstDirection: { type: String, required: true },
        secondDirection: { type: String },
        CP: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        telefono: { type: String, required: true },
    },
    numberOfItems: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    impuestos: { type: Number, required: true },
    total: { type: Number, required: true },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String },

    transactionId: { type: String },
    
}, {
    timestamps: true,
})

const Order = moongose.models.Order || model('Order', orderSchema);

export default Order;