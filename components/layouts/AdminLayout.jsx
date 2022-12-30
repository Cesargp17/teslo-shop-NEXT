import React from 'react'
import Head from "next/head"
import { Navbar } from '../ui/Navbar'
import { SideMenu } from '../ui/SideMenu'
import { AdminNavbar } from '../admin/AdminNavbar'
import { Box, Typography } from '@mui/material'

export const AdminLayout = ({ children, title, subTitle, icon }) => {
  return (
    <>
        <nav>
            <AdminNavbar/>
        </nav>

        <SideMenu/>

        <main style={{ margin: '80px auto', maxWidth: '1440px', padding: '0px 30px' }}>

            <Box display='flex' flexDirection='column'>
                <Typography variant='h1' component='h1'>
                    { icon }
                    {' '}{ title }
                </Typography>
                <Typography variant='h2' sx={{ mb: 1 }}>{ subTitle }</Typography>
            </Box>

            <Box className='fadeIn'>
                { children }
            </Box>
        </main>

        <footer>

        </footer>
    </>
  )
}
