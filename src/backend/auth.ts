import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/backend/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma as any) as any,
    trustHost: true,
    debug: true, // Enable debug logs to see exact error in Vercel
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log("Sign-in attempt:", { user, account, profile });
            return true;
        },
    },
    pages: {
        error: '/api/auth/error', // Redirect to custom or default error page
    }
})
