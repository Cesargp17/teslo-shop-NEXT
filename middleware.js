import { NextRequest, NextResponse, URLPattern } from 'next/server';
import * as jose from 'jose';
import jwt_decode from "jwt-decode"
 
 
export async function middleware(req) {

    const validRoles = [ 'admin', 'super-user', 'SEO' ];

    try {

        const token = req.cookies.get('token');
        if( !token ) return NextResponse.redirect(`http://localhost:3000/auth/login?p=${req.nextUrl.pathname}`);

        const user = jwt_decode(token);

        if (req.nextUrl.pathname.startsWith('/admin')) {
            if( !validRoles.includes( user.role ) ) {
                return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
            }
          }

        return NextResponse.next();
 
 
    } catch (error) {
 
        return NextResponse.redirect(`http://localhost:3000/auth/login?p=${req.nextUrl.pathname}`);
    }
 
 
}
 
export const config = {
    matcher: ['/checkout/address', '/checkout/summary', '/orders/history', '/admin/:path*']
};