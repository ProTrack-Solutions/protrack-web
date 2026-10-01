import NextAuth, { User } from "next-auth";
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

// Repassa para o navegador os cookies que o backend enviou no login.
async function forwardBackendCookies(backendCookies?: string[]) {
  if (!backendCookies) return;

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

// Monta o usuário do NextAuth a partir da resposta de /auth/login ou
// /auth/demo (mesmo formato nos dois).
async function buildSessionUser(
  data: {
    access_token?: string;
    refresh_token: string;
    expires_in: number;
    has_company: boolean;
  },
  isDemo: boolean,
): Promise<User | null> {
  if (!data?.access_token) return null;

  // Busca role/módulos do departamento pra já decidir a tela
  // inicial certa (dashboard financeiro, estoque, vendas...) sem
  // precisar de um segundo passo no client. Se falhar, o login
  // segue normalmente e o usuário cai no fallback padrão.
  let role: string | undefined;
  let modules: string[] | undefined;
  try {
    const meResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/me`,
      {
        headers: { Authorization: `Bearer ${data.access_token}` },
      },
    );
    role = meResponse.data?.role;
    modules = meResponse.data?.modules;
  } catch (meError) {
    console.error("Erro ao buscar /me após login:", meError);
  }

  return {
    id: "1", // NextAuth precisa de uma string ID
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpires: Date.now() + data.expires_in * 1000,
    hasCompany: data.has_company,
    role,
    modules,
    isDemo,
  };
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

          await forwardBackendCookies(response.headers["set-cookie"]);
          return buildSessionUser(response.data, false);
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
    // Entrada pelo botão "Ver demonstração": o backend devolve tokens do
    // usuário da empresa demo, sem senha.
    CredentialsProvider({
      id: "demo",
      name: "Demo",
      credentials: {},
      async authorize() {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/demo`,
            { aud: "protrack-web" },
          );

          await forwardBackendCookies(response.headers["set-cookie"]);
          return buildSessionUser(response.data, true);
        } catch (error) {
          console.error("Erro ao entrar na demonstração:", error);
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
          role: user.role,
          modules: user.modules,
          isDemo: user.isDemo,
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
      session.role = token.role as string | undefined;
      session.modules = token.modules as string[] | undefined;
      session.isDemo = token.isDemo as boolean | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Nome da sua rota pública de login
  },
});
