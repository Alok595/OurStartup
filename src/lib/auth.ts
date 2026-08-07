import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variable");
}

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
        
        // Strict verification against environment variables
        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          // Return a mock user object for the session
          return {
            id: "1",
            name: "Admin User",
            email: adminEmail,
            role: "admin",
          };
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
      // If signing in via Google, ensure the email exactly matches ADMIN_EMAIL or is in the AdminUser database
      if (account?.provider === "google") {
        if (user.email === adminEmail) {
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
  secret: process.env.NEXTAUTH_SECRET,
};
