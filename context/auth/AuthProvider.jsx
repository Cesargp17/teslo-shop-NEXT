import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useReducer } from 'react'
import tesloApi from '../../api/tesloApi'
import { AuthContext } from './AuthContext'
import { authReducer } from './authReducer'

const AUTH_INITIAL_STATE = {
    isLoggedIn: false,
    user: undefined
}

export const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const router = useRouter();
    
    useEffect(() => {
      checkToken()
    }, []);
    
    const checkToken = async() => {

        if(!Cookies.get('token')) return;         

        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { newToken, user } = data;
            Cookies.set('token', newToken );
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }

    }

    const checkingAuth = () => {
        dispatch({ type: '[Auth] - Checking' })
    }

    const errorAuth = () => {
        dispatch({ type: '[Auth] - Error' })
    }

    const loginUser = async( email, password ) => {
        checkingAuth();
        try {

            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;

        } catch (error) {
            errorAuth();
            return false;
        }

    };

    const registerUser = async( name, email, password ) => {
        checkingAuth();
        try {

            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            }

        } catch (error) {
            errorAuth();
            if( axios.isAxiosError(error) ){
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return {
                hasError: true,
                message: 'No se pudo crear el usuario, intente de nuevo'
            }
        }

    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('cart');
        router.reload();
    }

  return (
    <AuthContext.Provider value={{ ...state, loginUser, registerUser, logout }}>
        { children }
    </AuthContext.Provider>
  )
}
