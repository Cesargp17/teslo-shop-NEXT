import { Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { AuthLayout } from '../../components/layouts/AuthLayout'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { isEmail } from '../../utils/validations'
import tesloApi from '../../api/tesloApi'
import { ErrorOutline } from '@mui/icons-material'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth/authContext'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const RegisterPage = () => {

    const { registerUser, isLoggedIn } = useContext( AuthContext )
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const checkingAuth = useMemo(() => isLoggedIn !== false && isLoggedIn !== true, [isLoggedIn])

    const router = useRouter();

    const onRegisterUser = async({ email, password, name }) => {

        setShowError(false);
        const resp = await registerUser( name, email, password );

        if( resp.hasError ){
            setErrorMessage('Ya existe un usuario con ese email');
            setShowError(true)

            setTimeout(() => {
                setShowError(false)
            }, 3000);
            return;
        }
        const destination = router.query.p?.toString() || '/'
        router.replace(destination)
    };

  return (
    <AuthLayout title={'Registrarse - Teslo Shop'}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
            <form onSubmit={ handleSubmit( onRegisterUser ) }>
                <Grid container spacing={ 2 }>
                    <Grid item xs={ 12 }>
                        <Typography variant='h1' component='h1'>Registrarse</Typography>
                        { showError ? <Chip label={ errorMessage } color='error' icon={<ErrorOutline/>} sx={{ mt: 2 }} className='fadeIn' /> : null }
                    </Grid>

                    <Grid item xs={ 12 }>
                        <TextField 
                            label='Nombre' 
                            variant='filled'
                            fullWidth 
                            { 
                                ...register( 'name' ,{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 3, message: 'El nombre debe ser mayor a dos carácteres' }
                                }) 
                            }
                            error={ !!errors.name }
                            helperText={errors.name?.message}
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField 
                            label='Correo' 
                            variant='filled' 
                            fullWidth 
                            { ...register( 'email', {
                                    required: 'Este campo es requerido',
                                    validate: isEmail
                                }) 
                            }
                            error={ !!errors.email }
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField 
                            label='Password' 
                            type='password' 
                            variant='filled' 
                            fullWidth
                            { ...register('password', {
                                required: 'Ingresa una contraseña',
                                minLength: { value: 6, message: 'Minimo 6 carácteres' }
                            }) 
                        } 
                        error={ !!errors.password }
                        helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={ 12 }>
                        {
                            checkingAuth
                            ? <Button disabled type='submit' color='secondary' className='circular-btn' size='large' fullWidth>Registrandose...</Button>
                            : <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>Ingresar</Button>
                        }
                    </Grid>

                    <Grid item xs={ 12 } display='flex' justifyContent='end'>
                    <NextLink href={ router.query.p ? `/auth/login?p=${ router.query.p }` : 'auth/login'} passHref>
                            <Link underline='always'>
                                Ya tienes una cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </form>
        </Box>
    </AuthLayout>
  )
}

export default RegisterPage