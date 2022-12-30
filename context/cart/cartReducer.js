export const cartReducer = ( state, action ) => {
    switch (action.type) {

        case '[Cart] - LoadCart':
            return {
                ...state, isLoaded: true, cart: [...action.payload]
            }
        
        case '[Cart] - Add Product':
            return {
                ...state, cart: [...action.payload]
            }

        case '[Cart] - Change cart quantity':
            return {
                ...state, cart: state.cart.map( product => {
                    if( product._id !== action.payload._id ) return product;
                    if( product.size !== action.payload.size ) return product;
                    return action.payload;
                })
            }
            
        case '[Cart] - Remove product in cart':
            return {
                ...state, cart: [...action.payload]
            }

        case '[Cart] - Update order summary':
            return {
                ...state, ...action.payload
            }

        case '[Cart] - Update address':
        case '[Cart] - Load address from cookies':
            return {
                ...state, shippingAddress: action.payload
            }
        
        case '[Cart] - Order complete':
            return {
                ...state, cart: [],
                numberOfItems: 0,
                subTotal: 0,
                impuestos: 0,
                total: 0,
            }
    
        default:
            return state;
    }
}