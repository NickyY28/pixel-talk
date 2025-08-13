import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name : "Credentials",
            credentials:{
                email:{label: "Email", type: "text", placeholder: "you@example.com"},
                password:{label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }
                try {
                    await connectToDatabase()
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("User not found")
                    }
                    if (user.password !== credentials.password) {
                        throw new Error("Invalid password")
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        // You can add more user properties here if needed
                    }
                } catch (error) {
                    throw error
                }
            }
        }),
    ],
    callbacks:{
       async jwt({token,user}) {
        if (user){
            token.id = user.id
          }
          return token
       },
       async session({session,token}) {
          if(session.user){
            session.user.id = token.id as string;
          }
          return session;
       },
    },
    pages:{
       signIn :"/login",
       error: "/login"
    },
    session:{
        strategy:"jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
}