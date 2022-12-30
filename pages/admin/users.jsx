import { PeopleOutline } from '@mui/icons-material'
import React from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { DataGrid } from '@mui/x-data-grid'
import { Box, CircularProgress, Grid, MenuItem, Select, Typography } from '@mui/material'
import useSWR from 'swr'
import tesloApi from '../../api/tesloApi'
import { useState } from 'react'
import { useEffect } from 'react'

const UsersPage = () => {

    const { data, error } = useSWR('/api/admin/users');
    const [users, setUsers] = useState([]);

    useEffect(() => {
      if( data ){
        setUsers(data)       
      }
    }, [ data ])
    

    if( !error && !data ){
        return (<></>)
      }

      const onRoleUpdated = async( userId, newRole ) => {

        const previousUsers = users.map( user => ({ ...user }));

        const updatedUsers = users.map( user => ({
            ...user, 
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {

            await tesloApi.put(`/admin/users`, { userId, role: newRole });

        } catch (error) {

            setUsers(previousUsers);
            console.log(error);
            alert('No se pudo actualizar el rol del usuario');

        }

      }

    const columns = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({ row }) => {
                return (
                    <Select 
                        value={ row.role } 
                        label='Rol' 
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}>
                       <MenuItem value='admin'>Admin</MenuItem>
                       <MenuItem value='client'>Client</MenuItem>
                       <MenuItem value='super-user'>Super User</MenuItem>
                       <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                )
            }
        },
    ]

    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))

  return (
    <AdminLayout title={ 'Usuarios' } subTitle={ 'Mantenimiento de usuarios' } icon={ <PeopleOutline/> }>

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sx={{ height: 650, width: '100%^' }}>
                {
                    !users
                    ? <>
                        <Box justifyContent='center' display='flex'>
                            <CircularProgress/>
                        </Box>
                      </>
                    :   <DataGrid
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                        />
                }
            </Grid>
        </Grid>

    </AdminLayout>
  )
}

export default UsersPage