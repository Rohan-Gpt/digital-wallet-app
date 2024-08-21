import client from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password", placeholder: "afabf" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { phone, password } = credentials as Record<
          "phone" | "password",
          string
        >;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await client.user.findFirst({
          where: {
            number: phone,
          },
        });
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          }
          return null;
        }
        try {
          const newUser = await client.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
            },
          });
          await client.balance.create({
            data: {
              userId: newUser.id,
              amount: 0, // Initialize with 0 or any starting balance
              locked: 0,
            },
          });
          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.email,
          };
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
