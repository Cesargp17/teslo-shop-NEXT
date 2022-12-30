import React, { useRef } from 'react'
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { getProductBySlug } from '../../../database/dbProducts';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useState } from 'react';
import tesloApi from '../../../api/tesloApi';
import Product from '../../../models/Product';
import { useRouter } from 'next/router';

const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

const ProductAdminPage = ({ product }) => {

    const router = useRouter();
    const fileInputRef = useRef(null);
    const [newTagValue, setNewTagValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm({
        defaultValues: product
    });

    useEffect(() => {
      const subscription = watch(( value, { name, type } ) => {
        if( name === 'title'){
            const newSlug = value.title.trim().replaceAll(' ', '_').replaceAll("'", '').toLocaleLowerCase() || '';

            setValue('slug', newSlug)
        }
      });
    
      return () => subscription.unsubscribe();
    }, [ watch, setValue ])
    

    const onChangeSize = ( size ) => {
        const currentSizes = getValues('sizes');
        
        if( currentSizes.includes(size) ){
            return setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true });
        }

        setValue('sizes', [...currentSizes, size], { shouldValidate: true });
    }

    const onNewTag = ( tag ) => {

        const currentTags = getValues('tags');
        const newTag = tag.toLocaleLowerCase().trim();
        if( currentTags.includes(newTag) ) return;
        setValue('tags', [...currentTags, newTag], { shouldValidate: true });
        setNewTagValue('');
    }
    
    const onDeleteTag = ( tag ) => {

        const currentTags = getValues('tags');
        setValue('tags', currentTags.filter( t => t !== tag ), { shouldValidate: true })
    }

    const onFilesSelected = async( event ) => {
        if( !event.target.files || event.target.files.length === 0 ) return;

        
        try {
            for( const file of event.target.files ){
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApi.post('/admin/upload', formData);
                setValue('images', [...getValues('images'), data.msg], { shouldValidate: true });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteImage = async( image ) => {
        setValue('images', getValues('images').filter( img => img !== image ), { shouldValidate: true })
    }

    const onSubmit = async( form ) => {
        
        if( form.images.length < 2 ) return alert('Minimo 2 imagenes');
        setIsSaving(true);

        try {
            const { data }= await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST',
                data: form
            });

            console.log({ data })

            if( !form._id ){
                router.replace(`/admin/products/${ form.slug }`)
            } else {
                setIsSaving(false);
            }

        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }

    }

    return (
        <AdminLayout 
            title={'Producto'} 
            subTitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={ handleSubmit( onSubmit ) }>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button
                        disabled={ isSaving }
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: 'Este campo es requerido',
                                minLength: { value: 0, message: 'Mínimo de valor 0' }
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />
                        
                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('price', {
                                required: 'Este campo es requerido',
                                minLength: { value: 0, message: 'Minimo de valor 0' }
                            })}
                            error={ !!errors.price }
                            helperText={ errors.price?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={ (e) => setValue('type', e.target.value, { shouldValidate: true }) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={ (e) => setValue('gender', e.target.value, { shouldValidate: true }) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={ getValues('sizes').includes(size) } />} 
                                        label={ size } 
                                        onChange={ () => onChangeSize(size) }
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (value) => value.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            value={ newTagValue }
                            helperText="Presiona [spacebar] para agregar"
                            onChange={ ( e ) => setNewTagValue(e.target.value) }
                            onKeyPress={ (e) => e.key == " " && onNewTag( newTagValue ) }
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                onClick={ () => fileInputRef.current?.click() }
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                            >
                                Cargar imagen
                            </Button>
                            <input
                                ref={ fileInputRef }
                                type='file'
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                style={{ display: 'none' }}
                                onChange={ onFilesSelected }
                            />
                            
                            {
                                getValues('images').length < 2
                                ? <Chip label="Es necesario tener 2 imagenes" color='error' variant='outlined'/>
                                : null
                            }


                            <Grid container spacing={2}>
                                {
                                    getValues('images').map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button onClick={ () => onDeleteImage( img ) } fullWidth color="error">
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;

    let product = null;

    if( slug === 'new' ){
        const tempProduct = JSON.parse( JSON.stringify( new Product() ) );
        delete tempProduct._id;
        tempProduct.images = ['img1.jpg', 'img2.jpg'];
        product = tempProduct;
    } else {
        product = await getProductBySlug(slug.toString());
    }

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage