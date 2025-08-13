import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
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
       async jwt({}) {}
       async session({session,token}) {}
    },
    session:{
        strategy:"jwt"
    }
}