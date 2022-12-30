import React from 'react'
import { Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts/ShopLayout";
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading } from '../components/ui/FullScreenLoading';

export default function Home() {

  const { products, isLoading, isError } = useProducts('/products');

  return (
    <ShopLayout title={ 'Teslo-Shop - Home' } pageDescription={ 'Encuentra los mejores productos de Teslo aquí' }>
      <Typography variant="h1" component='h1'>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading/>
          : <ProductList products={ products } />
      }

    </ShopLayout>
  )
}
