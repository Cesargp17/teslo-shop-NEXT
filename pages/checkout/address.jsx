import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React from 'react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { CartContext } from '../../context/cart/CartContext'
import { countries } from '../../utils/countries'
import { isValidToken } from '../../utils/jwt'

const getAddressFromCookies = () => {

  
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    firstDirection: Cookies.get('firstDirection') || '',
    secondDirection: Cookies.get('secondDirection') || '',
    CP: Cookies.get('CP') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    telefono: Cookies.get('telefono') || '',
  }
}

const AdressPage = () => {
  
  const { updateAddress } = useContext( CartContext )
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: getAddressFromCookies()
  });

  const registerAddress = (data) => {
    updateAddress( data )
    router.push('/checkout/summary');
  }

  return (
    <ShopLayout title='Direccion' pageDescription='Confirmar direccion del destino'>
        <Typography variant='h1' component='h1'>Direccion</Typography>

          <form onSubmit={ handleSubmit(registerAddress) }>
        <Grid container spacing={ 2 } sx={{ mt: 2 }}>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField
                  label='Nombre' 
                  variant='filled' 
                  fullWidth
                  { ...register('firstName', {
                    required: 'Este campo es requerido',
                    }) 
                  } 
                  error={ !!errors.firstName }
                  helperText={errors.firstName?.message}
                />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField 
                  label='Apellido' 
                  variant='filled' 
                  fullWidth
                  { ...register('lastName', {
                    required: 'Este campo es requerido',
                    }) 
                  } 
                  error={ !!errors.lastName }
                  helperText={errors.lastName?.message}
                />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField  
                  label='Direccion' 
                  variant='filled' 
                  fullWidth
                  { ...register('firstDirection', {
                    required: 'Este campo es requerido',
                    }) 
                  } 
                  error={ !!errors.firstDirection }
                  helperText={errors.firstDirection?.message}
                />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField 
                 label='Direccion 2' 
                 variant='filled' 
                 fullWidth
                 { ...register('secondDirection', {
                  }) 
                }
                />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField 
                  label='Codigo Postal' 
                  variant='filled' 
                  fullWidth
                  { ...register('CP', {
                    required: 'Este campo es requerido',
                    }) 
                  } 
                  error={ !!errors.CP }
                  helperText={errors.CP?.message}
                />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField 
                  label='Ciudad' 
                  variant='filled' 
                  fullWidth
                  { ...register('city', {
                    required: 'Este campo es requerido',
                    }) 
                  } 
                  error={ !!errors.city }
                  helperText={errors.city?.message}
                  />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <FormControl fullWidth>
                  <TextField
                    select
                    defaultValue={ Cookies.get('country') || countries[0].code }
                    variant='filled' 
                    label='Pais' 
                    { ...register('country', {
                      required: 'Este campo es requerido',
                      }) 
                    } 
                    error={ !!errors.country }
                    // helperText={errors.country?.message}
                    >
                    {
                      countries.map( country => (
                        <MenuItem key={ country.code } value={ country.code }>{ country.name }</MenuItem>
                        ))
                      }
                  </TextField>
                </FormControl>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <TextField 
                  label='Telefono' 
                  variant='filled' 
                  fullWidth
                  { ...register('telefono', {
                    required: 'Este campo es requerido',
                    }) 
                  } 
                  error={ !!errors.telefono }
                  helperText={errors.telefono?.message}
                  />
            </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button type='submit' color='secondary' className='circular-btn' size='large'>Revisar pedido</Button>
        </Box>
              </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps = async ({ req }) => {
   
//   const { token } =  req.cookies;
//   let validToken = false;

//   try {
//     await isValidToken(token);
//     validToken = true;
//   } catch (error) {
//     validToken = false;
//   }

//   if( !validToken ){
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false,
//       }
//     }
//   }

//   return {
//     props: {
      
//     }
//   }
// }

export default AdressPage