import { Box, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { ProductList } from '../../components/products/ProductList'
import { FullScreenLoading } from '../../components/ui/FullScreenLoading'
import { getAllProducts, getProductsByTerm } from '../../database/dbProducts'
import { useProducts } from '../../hooks/useProducts'

const SearchPage = ({ products, search, foundProducts }) => {

  return (
    <ShopLayout title={ 'Teslo-Shop - Search' } pageDescription={ 'Encuentra los mejores productos de Teslo aquí' }>
        <Typography variant="h1" component='h1'>Buscar productos</Typography>

            {
                foundProducts
                    ? <Typography variant="h2" sx={{ mb: 1, mt: 2 }} textTransform='capitalize'>Resultados de tu busqueda: <strong style={{ color: '#3A64D8' }}>{ search }</strong></Typography>
                    :   <Box display='flex'>
                            <Typography variant="h2" sx={{ mb: 1, mt: 2 }}>No encontramos ningun producto</Typography>
                            <Typography variant="h2" sx={{ ml: 1, mt: 2 }} color='secondary' textTransform='capitalize'><strong>{ search }</strong></Typography>
                        </Box>
            }

        

        <ProductList products={ products } />

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async ({ params }) => {
   
    const { search = '' } = params;

    if( search.length === 0 ){
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await getProductsByTerm( search );
    const foundProducts = products.length > 0;

    if( !foundProducts ){
        products = await getAllProducts();
    }

    return {
        props: {
            products, search, foundProducts
        }
    }
}

export default SearchPage