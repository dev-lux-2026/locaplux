import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma"; // ✨ FIX : Aligné sur l'import nommé de votre projet (@/lib/prisma)
import bcrypt from "bcryptjs";

export { signIn } from "next-auth/react";

// Déclaration de surcharge des types Next-Auth pour un support TypeScript parfait
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      emailVerified: Date | boolean | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    firstName?: string | null;
    lastName?: string | null;
    emailVerified: Date | boolean | null;
  }
}

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

        // 🚫 Blocage strict : Impossible de se connecter si l'email n'est pas validé
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
      if (token && session.user) {
        session.user.id = token.id;
        session.user.emailVerified = token.emailVerified;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
