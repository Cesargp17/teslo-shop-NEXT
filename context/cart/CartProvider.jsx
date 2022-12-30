import React, { useReducer } from 'react'
import { CartContext } from './CartContext'
import { cartReducer } from './cartReducer'
import Cookie from 'js-cookie'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import tesloApi from '../../api/tesloApi'
import axios from 'axios'

const CART_INITIAL_STATE = {
  isLoaded: false,
  cart : Cookie.get('cart') ? JSON.parse(Cookie.get('cart')) : [],
  numberOfItems: 0,
  subTotal: 0,
  impuestos: 0,
  total: 0,
  shippingAddress: undefined
}

export const CartProvider = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE );

    useEffect(() => {
      Cookie.set('cart', JSON.stringify( state.cart ));
    }, [state.cart]);

    useEffect(() => {

      if( Cookies.get('firstName') ){

      const shippingAddress = {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        firstDirection: Cookies.get('firstDirection') || '',
        secondDirection: Cookies.get('secondDirection') || '',
        CP: Cookies.get('CP') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        telefono: Cookies.get('telefono') || '',
      }

      dispatch({ type: '[Cart] - Load address from cookies', payload: shippingAddress })
    }

    }, []);
    

    useEffect(() => {

      const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev , 0 );
      const subTotal = state.cart.reduce( ( prev, current ) => ( current.price * current.quantity ) + prev, 0 );
      const impuestos = subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
      const total = subTotal + impuestos;

      const orderSummary = {
        numberOfItems,
        subTotal,
        impuestos,
        total
      };

      dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
    }, [state.cart]);
    

    const addProductToCart = ( product ) => {

      const productInCart = state.cart.some( p => p._id === product._id );
      if( !productInCart ) return dispatch({ type: '[Cart] - Add Product', payload: [...state.cart, product]});

      const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size );
      if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Add Product', payload: [...state.cart, product]});

      const updatedProducts = state.cart.map( p => {
        if( p._id !== product._id ) return p;
        if( p.size !== product.size ) return p;
        p.quantity += product.quantity;
        return p;
      });

      dispatch({ type: '[Cart] - Add Product', payload: updatedProducts});
    };

    const updateCartQuantity = ( product ) => {
      dispatch({ type: '[Cart] - Change cart quantity', payload: product })
    };

    const removeCartProduct = ( product ) => {
      const updatedProductsInCart = state.cart.filter( p => p !== product);
      dispatch({ type: '[Cart] - Remove product in cart', payload: updatedProductsInCart })
    }

    const updateAddress = ( data ) => {
      Cookies.set('firstName', data.firstName);
      Cookies.set('lastName', data.lastName);
      Cookies.set('firstDirection', data.firstDirection);
      Cookies.set('secondDirection', data.secondDirection || '');
      Cookies.set('CP', data.CP);
      Cookies.set('city', data.city);
      Cookies.set('country', data.country);
      Cookies.set('telefono', data.telefono);
      
      dispatch({ type: '[Cart] - Update address', payload: data })
    }

    const createOrder = async() => {

      if( !state.shippingAddress ){
        throw new Error('No hay direccion de entrega');
      }

      const body = {
        orderItems: state.cart,
        shippingAddress: state.shippingAddress,
        numberOfItems: state.numberOfItems,
        subTotal: state.subTotal,
        impuestos: state.impuestos,
        total: state.total,
        isPaid: false,
      }

      try {

        const { data } = await tesloApi.post('/orders', body);
        dispatch({ type: '[Cart] - Order complete' });
        return {
          hasError: false,
          message: data._id
        }

      } catch (error) {
        if( axios.isAxiosError(error) ){
          return {
            hasError: true,
            message: error.response.data.msg
          }
        }
        return {
          hasError: true,
          message: 'Error no controlado, hable con el administrador'
        }
      }
    }

  return (
    <CartContext.Provider value={{ ...state, addProductToCart, updateCartQuantity, removeCartProduct, updateAddress, createOrder }}>
        { children }
    </CartContext.Provider>
  )
}
