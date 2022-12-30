import { AppBar, Badge, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import React from 'react'
import NextLink from 'next/link'
import { Box } from '@mui/system'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { UIContext } from '../../context/ui/UIContext'
import { useState } from 'react'
import { CartContext } from '../../context/cart/CartContext'

export const Navbar = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const { numberOfItems } = useContext( CartContext );

    const { toggleSideMenu } = useContext( UIContext );
    const { asPath, push } = useRouter();

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        push(`/search/${ searchTerm }`);
    }

  return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center'>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
                </Link>
            </NextLink>

            <Box flex={ 1 } />

            <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
                <NextLink href='/category/men' passHref>
                    <Link>
                        <Button color={ asPath === '/category/men' ? 'primary' : 'info' }>Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/woman' passHref>
                    <Link>
                        <Button color={ asPath === '/category/woman' ? 'primary' : 'info' }>Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink href='/category/kid' passHref>
                    <Link>
                        <Button color={ asPath === '/category/kid' ? 'primary' : 'info' }>Niños</Button>
                    </Link>
                </NextLink>
            </Box>

            <Box flex={ 1 } />

                {
                    isSearchVisible
                        ? (
                            <Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            className='fadeIn'
                            autoFocus
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value)  }
                            onKeyPress={ (e) => e.key === 'Enter' && onSearchTerm() }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={ () => setIsSearchVisible(false) }
                                    >
                                     <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        )
                        : (
                            <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} className='fadeIn' onClick={ () => setIsSearchVisible(true) }>
                                <SearchOutlined/>
                            </IconButton>
                        )
                }

            <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={ () => toggleSideMenu() }>
                <SearchOutlined/>
            </IconButton>

            <NextLink href='/cart' passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems > 9 ? '9+' : numberOfItems } color='secondary'>
                            <ShoppingCartOutlined/>
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={ () => toggleSideMenu() }>Menú</Button>

        </Toolbar>
    </AppBar>
  )
}
