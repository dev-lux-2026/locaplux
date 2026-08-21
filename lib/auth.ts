import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

// 🔥 AJOUT : export signIn pour verify-email
export { signIn } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // ✅ FIX TS strict: user.password peut être null
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password ?? ""
        );

        if (!isValid) return null;

        if (!user.emailVerified) {
          return {
            id: user.id,
            email: user.email,
            emailVerified: false,
            role: user.role,
          };
        }

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // 🔥 FIX TS strict: AdapterUser n’a pas emailVerified
        const u = user as any;

        token.id = u.id;
        token.emailVerified = u.emailVerified ?? false;
        token.role = u.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        // 🔥 FIX TS strict: session.user peut être undefined
        session.user = session.user ?? ({} as any);

        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
