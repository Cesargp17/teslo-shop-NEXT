import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useContext } from 'react'
import { CartContext } from '../../context/cart/CartContext'
import { format } from '../../utils/currency'

export const OrderSummary = ({ numberOfItems: items, subTotal: st, total: T, impuestos: Im }) => {

    const { numberOfItems, subTotal, impuestos, total } = useContext( CartContext )

    const productos = items ? items : numberOfItems;
    const sub = st ? st : subTotal;
    const tax = Im ? Im : impuestos;
    const totalAPagar = T ? T : total;

  return (
    <Grid container>
        <Grid item xs={ 6 }>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>{ productos } { productos > 1 ? 'Productos' : 'Producto' }</Typography>
        </Grid> 
            
        <Grid item xs={ 6 }>
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>{ format(sub) }</Typography>
        </Grid> 

        <Grid item xs={ 6 }>
            <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE)*100 }%)</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>{ format(tax) }</Typography>
        </Grid> 

        <Grid item xs={ 6 } sx={{ mt: 2 }}>
            <Typography variant='subtitle1'>Total:</Typography>
        </Grid>
        <Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>{ format(totalAPagar) }</Typography>
        </Grid> 
    </Grid>
  )
}
