import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import useSWR from 'swr'
import { SummaryTitle } from '../../components/admin/SummaryTitle'
import { AdminLayout } from '../../components/layouts/AdminLayout'

const DashboardPage = () => {

  const { data, error } = useSWR('/api/admin/dashboard', {
    refreshInterval: 30 * 1000
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {

    const interval = setInterval( () => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
    }, 1000 )
  
    return () => clearInterval( interval )
  }, [])
  
  
  if( error ){
    console.log(error);
    return <Typography>Error al cargar la informacion...</Typography>
  }

  return (
    <AdminLayout title='Dashboard' subTitle='Estadisticas generales' icon={ <DashboardOutlined/> }>

      {
        !data
        ? <>
            <Box justifyContent='center' display='flex'>
              <CircularProgress/>
            </Box>
          </>
        : <>
            <Grid container spacing={ 2 }>
              <SummaryTitle title={ data?.numberOfOrders } subTitle='Ordenes totales' icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }}/> }/> 
              <SummaryTitle title={ data?.paidOrders } subTitle='Ordenes pagadas' icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }}/> }/> 
              <SummaryTitle title={ data?.notPaidOrders } subTitle='Ordenes pendientes' icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/> }/> 
              <SummaryTitle title={ data?.numberOfClients } subTitle='Clientes' icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }}/> }/> 
              <SummaryTitle title={ data?.numberOfProducts } subTitle='Productos' icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }}/> }/> 
              <SummaryTitle title={ data?.productsWithNoInventory } subTitle='Sin existencias' icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/> }/> 
              <SummaryTitle title={ data?.productsWithLowInventory } subTitle='Bajo inventario' icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/> }/>
              <SummaryTitle title={ refreshIn } subTitle='Actualizacion en: ' icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/> }/> 
            </Grid>
          </>
      }
    </AdminLayout>
  )
}

export default DashboardPage