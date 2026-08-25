import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    hasCompany: boolean;
    error?: string;
    // Role e módulos do departamento no momento do login, usados só para
    // decidir a tela inicial (login/middleware). O controle de acesso de
    // verdade em cada página usa sempre o /me ao vivo (useMe/useModuleAccess).
    role?: string;
    modules?: string[];
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    hasCompany: boolean;
    role?: string;
    modules?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    hasCompany?: boolean;
    error?: string;
    role?: string;
    modules?: string[];
  }
}
