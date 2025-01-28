import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/mongodb';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { User } from '@/models/User';
import { mongooseConnect } from '@/lib/mongoose';

async function findUserByEmail(email) {
  await mongooseConnect();
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        name: { label: "Name", type: "text" },
      },
      authorize: async (credentials) => {
        const user = await findUserByEmail(credentials.email);
        console.log("Login attempt for email:", credentials.email);
        // console.log("Entered password:", credentials.password);
        // console.log("Stored hashed password:", user?.password);
        // console.log("User:", user);
        // console.log("Password:", user.password);

        if (user && user.password && user.role === "admin") {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isPasswordValid);

          if (isPasswordValid) {
            return {
              id: user._id,
              email: user.email,
              role: user.role,
              name: user.name,
              username: user.username,
              provider: user.provider,
              image: user.image,
            };
          } else {
            throw new Error("Invalid password");
          }
        } else {
          console.log("User not found or not an admin");
          return null;
        }
      },
    }),
  ],
  session: {
     strategy: "jwt" 
    },
  cookies: {
      sessionToken: {
        name: "next-auth.admin-token", // Unique cookie name for admin
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the token only on initial login
      if (user) {
        token.id = user.id.toString();
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Session callback", { session, token });
      // Populate session.user with JWT token data
      if (token) {
        session.user = {
          id: token.id,
          role: token.role,
          email: token.email,
          name: token.name,
          username: token.username,
          image: token.image,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.SECRET,
  debug: true,
};
export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.email) {
    const user = await findUserByEmail(session.user.email);

    if (user?.role !== 'admin') {
      res.status(401).end('You are not an admin');
      throw 'Not authorized';
    }
  } else {
    res.status(401).end('No session or email found');
    throw 'Not authorized';
  }
}