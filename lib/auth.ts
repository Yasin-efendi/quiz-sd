import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = credentials?.username as string
        const password = credentials?.password as string

        if (
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@quiz-sd.com',
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'

      if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return Response.redirect(new URL('/admin/login', nextUrl))
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl))
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) token.role = 'admin'
      return token
    },
    async session({ session, token }) {
      if (token.role) session.user.role = token.role as string
      return session
    },
  },
})