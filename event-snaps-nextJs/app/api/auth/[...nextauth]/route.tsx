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
                  'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file',
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
        async jwt({ token, account }: { token: any, account: any, }) {
            console.log('jwt callback',account)
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            return token;
        },

        async session({ session, token } : { session: any, token: any }) {
            session.accessToken = token.accessToken;
            session.user.id = token.sub;
            return session;
        },
    },



}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}