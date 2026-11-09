import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma"; 
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
          street: user.street,
          address: user.address || user.street, // ✨ Pont direct
          city: user.city,
          postal: user.postal,
          country: user.country,
          phone: user.phone,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.email = u.email;
        token.emailVerified = u.emailVerified ?? false;
        token.role = u.role;
        token.name = u.name;
        
        if (u.name && (!u.firstName || !u.lastName)) {
          const parts = u.name.trim().split(" ");
          token.firstName = parts[0] || null;
          token.lastName = parts.slice(1).join(" ") || null;
        } else {
          token.firstName = u.firstName || null;
          token.lastName = u.lastName || null;
        }

        token.street = u.street || null;
        token.address = u.address || u.street || null; // ✨ Pont direct
        token.city = u.city || null;
        token.postal = u.postal || null;
        token.country = u.country || null;
        token.phone = u.phone || null;
      }
      
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      
      return token;
    },

    async session({ session, token }) {
      if (token && token.email) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: {
              id: true,
              email: true,
              emailVerified: true,
              role: true,
              name: true,
              firstName: true,
              lastName: true,
              street: true,
              address: true,
              city: true,
              postal: true,
              country: true,
              phone: true,
            }
          });

          if (freshUser) {
            let calculatedFirstName = freshUser.firstName;
            let calculatedLastName = freshUser.lastName;

            if (freshUser.name && (!calculatedFirstName || !calculatedLastName)) {
              const parts = freshUser.name.trim().split(" ");
              calculatedFirstName = parts[0] || null;
              calculatedLastName = parts.slice(1).join(" ") || null;
            }

            session.user = {
              ...freshUser,
              address: freshUser.address || freshUser.street, // 🚀 LA CLÉ : Force address à récupérer street s'il est vide
              firstName: calculatedFirstName,
              lastName: calculatedLastName,
              emailVerified: freshUser.emailVerified ? true : false
            } as any;
            return session;
          }
        } catch (dbError) {
          console.error("🔴 Erreur récupération utilisateur frais session :", dbError);
        }
      }

      if (token && session.user) {
        const user = session.user as any;
        user.id = token.id as string;
        user.emailVerified = token.emailVerified as boolean;
        user.role = token.role as string;
        user.name = token.name as string | null;
        user.firstName = token.firstName as string | null;
        user.lastName = token.lastName as string | null;
        user.street = token.street as string | null;
        user.address = token.address || token.street || null; // ✨ Fallback sécurité
        user.city = token.city as string | null;
        user.postal = token.postal as string | null;
        user.country = token.country as string | null;
        user.phone = token.phone as string | null;
        session.user = user;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};