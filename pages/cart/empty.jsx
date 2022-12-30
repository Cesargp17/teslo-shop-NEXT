import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import NextLink from 'next/link';

const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription='No hay articulos en el carrito de compras'>
        <Box             
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }}/>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography marginLeft={ 2 }>Su carrito esta vacio</Typography>
                <NextLink href='/' passHref>
                    <Link typography='h4' color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage