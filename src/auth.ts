import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Chamada para a sua API Externa usando a URL do .env
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
              aud: "protrack-web",
            },
          );

          const data = response.data; // Seus dados: accessToken, hasCompany, etc.

          // Captura os cookies enviados pelo seu backend e repassa para o navegador
          const backendCookies = response.headers["set-cookie"];
          if (backendCookies) {
            const cookieStore = await cookies();
            backendCookies.forEach((cookieString) => {
              const [cookieParts] = cookieString.split(";");
              const [name, value] = cookieParts.split("=");
              cookieStore.set(name.trim(), value.trim(), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });
            });
          }

          // Se a API retornou o token com sucesso
          if (data && data.access_token) {
            return {
              id: "1", // NextAuth precisa de uma string ID
              accessToken: data.access_token,
              hasCompany: data.has_company,
            };
          }

          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.hasCompany = user.hasCompany;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.hasCompany = token.hasCompany;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Nome da sua rota pública de login
  },
});
