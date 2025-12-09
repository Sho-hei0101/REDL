import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("🔐 [AUTH] authorize() start")

        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          console.log("❌ [AUTH] invalid payload:", parsed.error.flatten())
          return null
        }

        const { email, password } = parsed.data
        console.log("📩 [AUTH] email input:", email)

        const user = await prisma.user.findUnique({
          where: { email },
        })
        console.log("🧑 [AUTH] user from DB:", user)

        if (!user) {
          console.log("❌ [AUTH] no-user:", email)
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword)
        console.log("🔍 [AUTH] password match:", passwordsMatch)

        if (!passwordsMatch) {
          console.log("❌ [AUTH] bad-password:", email)
          return null
        }

        console.log("✅ [AUTH] success login:", email)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
