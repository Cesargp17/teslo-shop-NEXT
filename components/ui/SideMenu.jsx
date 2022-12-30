
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useContext } from "react"
import { UIContext } from "../../context/ui/UIContext"
import { useRouter } from "next/router"
import { useState } from "react"
import { AuthContext } from "../../context/auth/authContext"

export const SideMenu = () => {

    const { isMenuOpen, toggleSideMenu } = useContext( UIContext );
    const [searchTerm, setSearchTerm] = useState('');

    const { isLoggedIn, user, logout } = useContext( AuthContext );

    const router = useRouter();

    const navigateTo = ( url ) => {
        toggleSideMenu();
        router.push( url );
    };

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        navigateTo(`/search/${ searchTerm }`);
    }

  return (
    <Drawer
    open={ isMenuOpen }
    anchor='right'
    onClose={ toggleSideMenu }
    sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
>
    <Box sx={{ width: 250, paddingTop: 5 }}>
        
        <List>

            <ListItem>
                <Input
                    autoFocus
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value)  }
                    onKeyPress={ (e) => e.key === 'Enter' && onSearchTerm() }
                    type='text'
                    placeholder="Buscar..."
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            onClick={ () => onSearchTerm() }
                            aria-label="toggle password visibility"
                            >
                             <SearchOutlined />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </ListItem>

            <ListItem button sx={{ display: isLoggedIn ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <AccountCircleOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Perfil'} />
            </ListItem>

            <ListItem button onClick={ () => navigateTo('/orders/history') } sx={{ display: isLoggedIn ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <ConfirmationNumberOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Mis Ordenes'} />
            </ListItem>


            <ListItem onClick={ () => navigateTo( '/category/men' ) } button sx={{ display: { xs: '', sm: 'none' } }}>
                <ListItemIcon>
                    <MaleOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Hombres'} />
            </ListItem>

            <ListItem onClick={ () => navigateTo( '/category/woman' ) } button sx={{ display: { xs: '', sm: 'none' } }}>
                <ListItemIcon>
                    <FemaleOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Mujeres'} />
            </ListItem>

            <ListItem onClick={ () => navigateTo( '/category/kid' ) }  button sx={{ display: { xs: '', sm: 'none' } }}>
                <ListItemIcon>
                    <EscalatorWarningOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Niños'} />
            </ListItem>


            <ListItem onClick={ () => navigateTo( `/auth/login?p=${ router.asPath }` ) } button sx={{ display: !isLoggedIn ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <VpnKeyOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Ingresar'} />
            </ListItem>

            <ListItem onClick={ () => logout() } button sx={{ display: isLoggedIn ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <LoginOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Salir'} />
            </ListItem>


            {/* Admin */}
            <Divider sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }} />
            <ListSubheader sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }}>Admin Panel</ListSubheader>

            <ListItem onClick={ () => navigateTo( `/admin` ) } button sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <DashboardOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
            </ListItem>
            <ListItem onClick={ () => navigateTo( `/admin/products` ) } button sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <CategoryOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Productos'} />
            </ListItem>
            <ListItem onClick={ () => navigateTo( `/admin/orders` ) } button sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <ConfirmationNumberOutlined/>
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
            </ListItem>

            <ListItem onClick={ () => navigateTo( `/admin/users` ) } button sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }}>
                <ListItemIcon>
                    <AdminPanelSettings/>
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
            </ListItem>
        </List>
    </Box>
</Drawer>
  )
}
