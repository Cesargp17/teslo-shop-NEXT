import { Button, Chip, Grid, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import NextLink from 'next/link'
import { isValidToken } from '../../utils/jwt'
import jwt_decode from "jwt-decode";
import { getOrdersByUser } from '../../database/dbOrders'

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    { 
        field: 'paid', headerName: 'Pagada', description: 'Muestra la informacion si la orden esta pagada o no', width: 200, 
        renderCell: ( params ) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined'/>
                    : <Chip color='error' label='No Pagada' variant='outlined'/>
            )
        }
    },
    {
        field: 'order',
        headerName: 'Mostrar orden',
        description: 'Mostrar la pagina de la orden',
        width: 200,
        sortable: false,
        renderCell: (params) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Button variant='contained' color='primary'>
                        Ver orden
                    </Button>
                </NextLink>
            )
        }
    },
];

// const rows = [
//     { id: 1, paid: true, fullname: 'Cesar Perez' },
//     { id: 2, paid: false, fullname: 'Yadira Perez' },
//     { id: 3, paid: true, fullname: 'Benjamin Perez' },
//     { id: 4, paid: true, fullname: 'Mar Galilea' },
//     { id: 5, paid: false, fullname: 'Andres Diaz' },
//     { id: 6, paid: true, fullname: 'Hector Martinez' },
// ]

const HistoryPage = ({ orders }) => {


    const rows = orders.map( ( order, i ) => ({
        id: i + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))

  return (
    <ShopLayout title={ 'Historial de ordenes' } pageDescription={ 'Historial de ordenes del cliente' }>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sx={{ height: 650, width: '100%^' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async ({ req }) => {
    
    const { token } = req.cookies;
    let decoded = jwt_decode( token );

    const orders = await getOrdersByUser( decoded._id );

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage