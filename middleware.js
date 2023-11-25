import { NextResponse } from "next/server";

export function middleware(req){
    let verify = req.cookies.get('rs-sp')
    var response = NextResponse.next()

    if(!verify && req.nextUrl.pathname !== '/'){
        response = NextResponse.redirect(new URL('/', req.nextUrl))
    }
    return response
}

export const config = {
    matcher : ['/questions', '/profile', '/api/:path*']
}