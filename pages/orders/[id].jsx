import { Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
const CartList = dynamic(() => import("../../components/cart/CartList").then(i => i.CartList), { ssr: false, });
import { OrderSummary } from '../../components/cart/OrderSummary'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import NextLink from 'next/link'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { isValidToken } from '../../utils/jwt'
import { getOrderById } from '../../database/dbOrders'
import jwt_decode from "jwt-decode";
import { countries } from '../../utils/countries'
import dynamic from 'next/dynamic';
import { PayPalButtons } from '@paypal/react-paypal-js';
import tesloApi from '../../api/tesloApi';
import { useRouter } from 'next/router';
import { useState } from 'react';

const OrderPage = ({ order }) => {

    const router = useRouter();

    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async( details ) => {
        
        setIsPaying(true);

        if( details.status !== 'COMPLETED' ){
            return alert('No hay pago en PayPal');
        }

        try {

            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {

            setIsPaying(false);
            console.log(error)
            alert('Error')

        }
    }

  return (
    <ShopLayout title={`Resumen de orden ${ order._id }`} pageDescription='Resumen de la orden'>
        <Typography sx={{ mb: 2 }} variant='h1' component='h1'>Orden: { order._id }</Typography>

        {
            order.isPaid
            ? <Chip sx={{ my: 2 }} label='La orden ya fue pagada' variant='outlined' color='success' icon={ <CreditScoreOutlined/> }/>
            : <Chip sx={{ my: 2 }} label='Pendiente de pago' variant='outlined' color='error' icon={ <CreditCardOffOutlined/> }/>
        }

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList products={ order.orderItems } />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.orderItems.length } { order.orderItems.length > 1 ? 'Productos' : 'Producto' } )</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                        </Box>
                        
                        <Typography>{ order.shippingAddress.firstName } { order.shippingAddress.lastName }</Typography>
                        <Typography>{ order.shippingAddress.firstDirection }, { order.shippingAddress?.secondDirection }</Typography>
                        <Typography>{ order.shippingAddress.city }, { order.shippingAddress.CP }</Typography>
                        <Typography>{ countries.find( c => c.code === order.shippingAddress?.country )?.name }</Typography>
                        <Typography>{ order.shippingAddress.telefono }</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mb: 1 }} display='flex' justifyContent='end'>
                        </Box>

                        <OrderSummary numberOfItems={ order.numberOfItems } subTotal={ order.subTotal } total={ order.total } impuestos={ order.impuestos } />

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                        
                        <Box  sx={{ display: isPaying ? 'flex' : 'none' }} display='flex' justifyContent='center' className='fadeIn'>
                            <CircularProgress/>
                        </Box>

                        <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
                            {
                                order.isPaid
                                    ? <Chip sx={{ my: 2 }} label='La orden ya fue pagada' variant='outlined' color='success' icon={ <CreditScoreOutlined/> }/>
                                    : <>
                                        <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: order.total,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        onOrderCompleted( details );
                                                        // console.log({ details })
                                                        // const name = details.payer.name.given_name;
                                                        // alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                    </>
                            }
                        </Box>

                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async ({ req, query }) => {
    
    const { id = '' } =  query;
    const { token } = req.cookies;

    let validToken = false;
    
    try {
        await isValidToken( token );
        validToken = true;
    } catch (error) {
        validToken = false;
    }

    if( !validToken ){
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${ id }`,
                permanent: false
            }
        }
    }

    const order = await getOrderById( id );

    if( !order ){
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    let decoded = jwt_decode( token );

    if( order.user !== decoded._id ){
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage