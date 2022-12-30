import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr'
import { AuthProvider } from '../context/auth/AuthProvider'
import { CartProvider } from '../context/cart/CartProvider'
import { UIProvider } from '../context/ui/UIProvider'
import '../styles/globals.css'
import { lightTheme } from '../themes/light-theme'

function MyApp({ Component, pageProps }) {
  return (
      <SWRConfig 
      value={{
        // refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <AuthProvider>
          <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={ lightTheme }>
                  <CssBaseline/>
                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </PayPalScriptProvider>
        </AuthProvider>
      </SWRConfig>
  )
}

export default MyApp
