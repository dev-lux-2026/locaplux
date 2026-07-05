import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import {
  CURRENT_TERMS_VERSION,
  CURRENT_PARTNER_TERMS_VERSION,
} from "@/lib/terms";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            status: true,                // <-- IMPORTANT
            emailVerified: true,
            acceptedTermsAt: true,
            acceptedPartnerTermsAt: true,
            termsVersion: true,
            partnerTermsVersion: true,
          },
        });

        if (!user) return null;

        // 🚫 Empêcher login Credentials sur un compte Google
        if (!user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        // 🚫 Empêcher connexion si email non validé
        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // 🔥 ON TRANSMET ENFIN LE STATUT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status, // <-- AJOUT CRUCIAL
          acceptedTermsAt: user.acceptedTermsAt,
          acceptedPartnerTermsAt: user.acceptedPartnerTermsAt,
          termsVersion: user.termsVersion,
          partnerTermsVersion: user.partnerTermsVersion,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // 🔒 Acheteur : doit avoir accepté CGU/CGV + bonne version
      if (user.role === "user") {
        if (!user.acceptedTermsAt || user.termsVersion !== CURRENT_TERMS_VERSION) {
          return "/legal/accept-terms";
        }
      }

      // 🔒 Partenaire : doit avoir accepté CGV Partenaires + bonne version
      if (user.role === "partner") {
        if (
          !user.acceptedPartnerTermsAt ||
          user.partnerTermsVersion !== CURRENT_PARTNER_TERMS_VERSION
        ) {
          return "/legal/accept-partner-terms";
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status; // <-- AJOUT CRUCIAL
        token.acceptedTermsAt = user.acceptedTermsAt;
        token.acceptedPartnerTermsAt = user.acceptedPartnerTermsAt;
        token.termsVersion = user.termsVersion;
        token.partnerTermsVersion = user.partnerTermsVersion;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status; // <-- AJOUT CRUCIAL
        session.user.acceptedTermsAt = token.acceptedTermsAt;
        session.user.acceptedPartnerTermsAt = token.acceptedPartnerTermsAt;
        session.user.termsVersion = token.termsVersion;
        session.user.partnerTermsVersion = token.partnerTermsVersion;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // pour gérer EMAIL_NOT_VERIFIED
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
