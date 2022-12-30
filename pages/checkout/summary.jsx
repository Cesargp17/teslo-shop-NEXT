import { Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
const CartList = dynamic(() => import("../../components/cart/CartList").then(i => i.CartList), { ssr: false, });
import { OrderSummary } from '../../components/cart/OrderSummary'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import NextLink from 'next/link'
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { countries } from '../../utils/countries';
import { useRouter } from 'next/router';

const SummaryPage = () => {

    const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext );
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const onCreateOrder = async() => {
        setIsPosting(true);
        const { hasError, message } = await createOrder();

        if( hasError ){
            setIsPosting(false);
            setErrorMessage( message );
            return;
        }
        router.replace(`/orders/${ message }`);
    }

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
        <Typography sx={{ mb: 2 }} variant='h1' component='h1'>Resumen de la orden</Typography>
        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList/>
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>{ numberOfItems } ({ numberOfItems > 1 ? 'Productos' : 'Producto' })</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>
                        
                        <Typography>{ shippingAddress?.firstName } { shippingAddress?.lastName }</Typography>
                        <Typography>{ shippingAddress?.firstDirection }, { shippingAddress?.secondDirection }</Typography>
                        <Typography>{ shippingAddress?.city }, { shippingAddress?.CP }</Typography>
                        <Typography>{ countries.find( c => c.code === shippingAddress?.country )?.name }</Typography>
                        <Typography>{ shippingAddress?.telefono }</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mb: 1 }} display='flex' justifyContent='end' flexDirection='column'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary/>

                        <Box sx={{ mt: 3 }}>
                            <Button disabled={ isPosting } onClick={ () => onCreateOrder() } color='secondary' className='circular-btn' fullWidth>Confirmar orden</Button>

                            <Chip color='error' label={ errorMessage } sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }} />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage