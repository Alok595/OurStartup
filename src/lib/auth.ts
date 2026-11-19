import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

const getAdminEmail = () => process.env.ADMIN_EMAIL || "";
const getAdminPassword = () => process.env.ADMIN_PASSWORD || "";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const adminEmail = getAdminEmail();
        const adminPassword = getAdminPassword();

        // 1. Strict verification against environment variables (if set)
        if (
          adminEmail &&
          adminPassword &&
          credentials.email.toLowerCase() === adminEmail.toLowerCase() &&
          credentials.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: adminEmail,
            role: "admin",
          };
        }

        // 2. Also check database for registered admins
        try {
          await connectToDatabase();
          const existingAdmin = await AdminUser.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (existingAdmin && existingAdmin.password === credentials.password) {
            return {
              id: existingAdmin._id.toString(),
              name: existingAdmin.name || "Admin",
              email: existingAdmin.email,
              role: "admin",
            };
          }
        } catch (error) {
          console.error("Authorize Admin DB Error:", error);
        }

        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const adminEmail = getAdminEmail();

      // If signing in via Google, ensure the email exactly matches ADMIN_EMAIL or is in the AdminUser database
      if (account?.provider === "google") {
        if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) {
          return true;
        } else {
          try {
            await connectToDatabase();
            const existingAdmin = await AdminUser.findOne({ email: user.email?.toLowerCase() });
            if (existingAdmin) {
              return true;
            }
          } catch (error) {
            console.error("Auth DB Error:", error);
          }
          // Reject login if it's not the admin email and not in the DB
          return "/login?error=AccessDenied";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "genzdevworks_secure_auth_secret_key_2026",
};
