import { Grid } from '@mui/material'
import React from 'react'
import { ProductCard } from './ProductCard'

export const ProductList = ({ products }) => {
  return (
    <Grid container spacing={ 4 }>
        {
            products.map( product => (
                <ProductCard key={ product.slug } product={ product } />
            ))
        }
    </Grid>
  )
}
