import NextAuth from "next-auth/next";
import prisma from '../../../libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { SessionStrategy } from "next-auth";


export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
    
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {    
                access_type: "offline",            
                scope:
                  'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive',
                },
              },   
        }),        
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    database: process.env.DATABASE_URL,
    debug: process.env.NODE_ENV === "development",
    callbacks: {   
        async session({ session, token } : { session: any, token: any }) {
            session.user.id = token.sub;
            return session;
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}