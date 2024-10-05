import client from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'


const adminEmails = ['benedicto.angelito.a@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    session: ({session,token,user}) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
      
    },
  },
  secret: process.env.SECRET,
  timeout: 30000, // increase the timeout to 30 seconds
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res){
  const session = await getServerSession(req, res, authOptions)
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'You are not an admin';
  }
}