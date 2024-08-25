import client from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'


const authInstance = NextAuth({
  secret: process.env.SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],
    adapter: MongoDBAdapter(client),
    // Add the timeout option here
    timeout: 10000, // increase the timeout to 5 seconds
  });
  
  export default async function handler(req, res) {
    return authInstance(req, res);
  }