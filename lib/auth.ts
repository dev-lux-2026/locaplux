import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

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
          throw new Error("Champs manquants.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("CredentialsSignin");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password ?? ""
        );

        if (!isValid) {
          throw new Error("CredentialsSignin");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.emailVerified = u.emailVerified ?? false;
        token.role = u.role;
        token.name = u.name;
        token.firstName = u.firstName || null;
        token.lastName = u.lastName || null;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        // 🔥 FIX FINAL : cast propre et définitif
        const user = session.user as any;

        user.id = token.id as string;
        user.emailVerified = token.emailVerified as boolean;
        user.role = token.role as string;
        user.name = token.name as string | null;
        user.firstName = token.firstName as string | null;
        user.lastName = token.lastName as string | null;

        session.user = user;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
