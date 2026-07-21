import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    hasCompany: boolean;
    error?: string;
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    hasCompany: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    hasCompany?: boolean;
    error?: string;
  }
}
