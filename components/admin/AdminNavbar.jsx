import { AppBar, Badge, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import React from 'react'
import NextLink from 'next/link'
import { Box } from '@mui/system'
import { useContext } from 'react'
import { UIContext } from '../../context/ui/UIContext'

export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext( UIContext );

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

            <Button onClick={ () => toggleSideMenu() }>Menú</Button>

        </Toolbar>
    </AppBar>
  )
}
