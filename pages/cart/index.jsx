import { Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
const CartList = dynamic(() => import("../../components/cart/CartList").then(i => i.CartList), { ssr: false, });
import { OrderSummary } from '../../components/cart/OrderSummary'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { CartContext } from '../../context/cart/CartContext';
import { cartReducer } from '../../context/cart/cartReducer';

const CartPage = () => {

    const { numberOfItems, isLoaded } = useContext( CartContext );

  return (
    <ShopLayout title={`Carrito - ${ numberOfItems > 9 ? '9+' : numberOfItems }`} pageDescription='Carrito de compras de la tienda'>
        <Typography variant='h1' component='h1'>Carrito</Typography>
        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable/>
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Orden</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <OrderSummary/>

                        <Box sx={{ mt: 3 }}>
                            <Link href='/checkout/address' passHref prefetch>
                                <Button disabled={ numberOfItems === 0 ? true : false } color='secondary' className='circular-btn' fullWidth>Checkout</Button>
                            </Link>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default CartPage