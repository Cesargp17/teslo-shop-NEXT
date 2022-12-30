import NextLink from 'next/link'
import { Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import { initialData } from "../../database/seed-data"
import { Box } from '@mui/system'
import { ItemCounter } from '../ui/ItemCounter'
import { CartContext } from '../../context/cart/CartContext'
import { useContext } from 'react'

export const CartList = ({ editable, products }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext( CartContext );

    const onNewCartQuantityValue = ( product, newQuantityValue ) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product )
    }

    const productsToShow = products ? products : cart

  return (
    <>
        {
            productsToShow.map( product => (
                <Grid container spacing={ 2 } sx={{ mb: 1 }} key={ product.slug + product.size }>
                    <Grid item xs={ 3 }>
                        <NextLink href={ `/product/${ product.slug }` } passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={ `${ product.image }` }
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={ 7 }>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>
                            {
                                editable
                                ? <ItemCounter currentValue={ product.quantity } maxValue={ 10 } updatedQuantity={ ( value ) => onNewCartQuantityValue( product, value ) }/>
                                : <Typography variant='h5'>{ product.quantity } { product.quantity > 1 ? 'productos' : 'producto' } </Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'>{ `$${ product.price }` }</Typography>
                            {
                                editable && <Button onClick={ () => removeCartProduct( product ) } variant='text' color='secondary'>Remover</Button>
                            }
                    </Grid>
                </Grid>
            ))
        }
    </>
  )
}
