import { Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { AuthLayout } from '../../components/layouts/AuthLayout'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { isEmail } from '../../utils/validations'
import tesloApi from '../../api/tesloApi'
import { ErrorOutline } from '@mui/icons-material'
import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth/authContext'
import Router, { useRouter } from 'next/router'
import { useMemo } from 'react'

const LoginPage = () => {

    const { loginUser, isLoggedIn } = useContext( AuthContext )
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showError, setShowError] = useState(false);

    const checkingAuth = useMemo(() => isLoggedIn !== false && isLoggedIn !== true, [isLoggedIn])
    const router = useRouter();

    const onLoginUser = async({ email, password }) => {

        setShowError(false);
            
        const isValidLogin = await loginUser( email, password );

        if( !isValidLogin ){
            console.log('Error en las credenciales');
            setShowError(true);
            setTimeout(() => {
                setShowError(false)
            }, 3000);
            return;
        }
        const destination = router.query.p?.toString() || '/'
        router.replace(destination)
    }

  return (
    <AuthLayout title={'Ingresar - Teslo Shop'}>
        <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={ 2 }>
                    <Grid item xs={ 12 }>
                        <Typography variant='h1' component='h1'>Iniciar Sesion</Typography>
                        { showError ? <Chip label='No reconocemos ese Usuario / Contraseña' color='error' icon={<ErrorOutline/>} sx={{ mt: 2 }} className='fadeIn' /> : null }
                    </Grid>

                    <Grid item xs={ 12 }>
                        <TextField 
                        type='email' 
                            { ...register('email', { 
                                    required: 'Este campo es requerido',
                                    validate: isEmail
                                }) 
                            } 
                            label='Correo' 
                            variant='filled' 
                            fullWidth
                            error={ !!errors.email }
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField 
                            { ...register('password', {
                                    required: 'Ingresa una contraseña',
                                    minLength: { value: 6, message: 'Minimo 6 carácteres' }
                                }) 
                            } 
                            label='Password' 
                            type='password' 
                            variant='filled' 
                            fullWidth 
                            error={ !!errors.password }
                            helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={ 12 }>
                        {
                            checkingAuth
                            ? <Button disabled type='submit' color='secondary' className='circular-btn' size='large' fullWidth>Iniciando sesión...</Button>
                            : <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>Ingresar</Button>
                        }
                    </Grid>

                    <Grid item xs={ 12 } display='flex' justifyContent='end'>
                        <NextLink href={ router.query.p ? `/auth/register?p=${ router.query.p }` : 'auth/register'} passHref>
                            <Link underline='always'>
                                No tienes una cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export default LoginPage