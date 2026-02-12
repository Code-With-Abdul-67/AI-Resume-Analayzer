import NextAuth, { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/backend/lib/prisma"

// 1. Fix TypeScript errors for the session object
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    // trustHost is vital for Vercel/proxies
    trustHost: true,
    debug: process.env.NODE_ENV === "development", 
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            // Google usually requires this to link multiple login methods
            allowDangerousEmailAccountLinking: true, 
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            // In v5 with an Adapter, 'user' is the database user
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
})