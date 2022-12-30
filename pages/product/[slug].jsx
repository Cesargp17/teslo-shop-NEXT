import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { ProductSlideshow } from '../../components/products/ProductSlideshow';
import { SizeSelector } from '../../components/products/SizeSelector';
import { ItemCounter } from '../../components/ui/ItemCounter';
import { CartContext } from '../../context/cart/CartContext';
import { getAllProductSlugs, getProductBySlug } from '../../database/dbProducts';

const ProductPage = ({ product }) => {

  const router = useRouter();
  const { addProductToCart } = useContext( CartContext );

  const [tempCartProduct, setTempCartProduct] = useState({ 
    _id: product._id, 
    image: product.images[0],
    price: product.price, 
    size: undefined,
    slug: product.slug,
    title: product.title, 
    gender: product.gender,
    quantity: 1,
   });

   const selectedSize = ( size ) => {
    setTempCartProduct({
      ...tempCartProduct, size
    })
   };

   const onUpdateQuantity = ( quantity ) => {
    setTempCartProduct({ ...tempCartProduct, quantity })
   };

   const onAddProduct = () => {
    if( !tempCartProduct.size ) return;
    addProductToCart(tempCartProduct)
    router.push('/cart')
   }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description } >
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 7 }>
          <ProductSlideshow images={ product.images }/>
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>${ product.price }</Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter currentValue={ tempCartProduct.quantity } updatedQuantity={ onUpdateQuantity } maxValue={ product.inStock > 5 ? 5 : product.inStock }/>
              <SizeSelector selectedSize={tempCartProduct.size} sizes={product.sizes} onSelectSize={ (size) => selectedSize(size) } />
            </Box>

            {
              product.inStock === 0 
                ? <Chip label='No hay disponibles' color='error' variant='outlined' />
                : (
                  <Button onClick={ () => onAddProduct() } color='secondary' className='circular-btn'>
                   {
                    tempCartProduct.size
                    ? 'Agregar al Carrito'
                    : 'Seleccione una talla'
                   }
                  </Button>
                )
            }
            

            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps = async (ctx) => {

//   const { slug } = ctx.params;
//   const product = await getProductBySlug( slug );

//   if( !product ){
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async (ctx) => {
  const slugs = await getAllProductSlugs();

  return {
    paths: slugs.map( ({ slug }) => ({
      params: { slug }
    })),
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps = async (ctx) => {
  
  const { slug } = ctx.params;
  const product = await getProductBySlug( slug );

    if( !product ){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}

export default ProductPage