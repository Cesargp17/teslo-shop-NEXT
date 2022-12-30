import { Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { ProductList } from '../../components/products/ProductList'
import { FullScreenLoading } from '../../components/ui/FullScreenLoading'
import { useProducts } from '../../hooks/useProducts'

const WomenPage = () => {

    const { products, isLoading, isError } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={ 'Teslo-Shop - Mujeres' } pageDescription={ 'Encuentra los mejores productos de Teslo para mujeres aquí' }>
        <Typography variant="h1" component='h1'>Tienda</Typography>
        <Typography variant="h2" sx={{ mb: 1 }}>Hombres</Typography>

        {
            isLoading
            ? <FullScreenLoading/>
            : <ProductList products={ products } />
        }

    </ShopLayout>
  )
}

export default WomenPage