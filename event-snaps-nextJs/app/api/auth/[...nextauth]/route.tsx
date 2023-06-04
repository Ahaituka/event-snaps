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
        }),        
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    database: process.env.DATABASE_URL,
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}