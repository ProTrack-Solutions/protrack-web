import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { cookies } from "next/headers";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        refresh_token: token.refreshToken,
      },
    );

    const data = response.data;

    return {
      ...token,
      accessToken: data.access_token,
      // Se o backend rotacionar o refresh token, usa o novo; senão mantém o atual
      refreshToken: data.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Erro ao renovar access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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
              refreshToken: data.refresh_token,
              accessTokenExpires: Date.now() + data.expires_in * 1000,
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
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      // Primeiro login: popula o token
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          hasCompany: user.hasCompany,
        };
      }

      if (trigger === "update" && session?.hasCompany !== undefined) {
        return {
          ...token,
          hasCompany: session.hasCompany,
        };
      }

      // Token ainda válido (com margem de 30s pra evitar corrida)
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number) - 30_000
      ) {
        return token;
      }

      // Token expirado: tenta renovar
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.hasCompany = token.hasCompany as boolean;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Nome da sua rota pública de login
  },
});
