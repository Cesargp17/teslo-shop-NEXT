import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { isValidObjectId } from 'mongoose'
import React from 'react'
import { ShopLayout } from '../../../components/layouts/ShopLayout'
import { getOrderById } from '../../../database/dbOrders'
import { Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { Box } from '@mui/system'
import { countries } from '../../../utils/countries'
import { OrderSummary } from '../../../components/cart/OrderSummary'
const CartList = dynamic(() => import("../../../components/cart/CartList").then(i => i.CartList), { ssr: false, });

const OrderPage = ({ order }) => {

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

                            {
                                order.isPaid
                                    ? <Chip sx={{ my: 2 }} label='La orden ya fue pagada' variant='outlined' color='success' icon={ <CreditScoreOutlined/> }/>
                                    : <Chip sx={{ my: 2 }} label='Pendiente de pago' variant='outlined' color='error' icon={ <CreditCardOffOutlined/> }/>
                            }
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

    if( !isValidObjectId(id) ){
        return {
            redirect: {
                destination: `/admin/orders`,
                permanent: false
            }
        }
    }

    const order = await getOrderById( id );

    return {
        props: {
            order
        }
    }
}

export default OrderPage