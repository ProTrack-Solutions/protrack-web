// src/middleware.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const hasCompany = req.auth?.hasCompany;
  const { nextUrl } = req;

  // Define se o usuário está tentando acessar a página de login
  const isAuthRoute = nextUrl.pathname === "/login";

  // Lista de páginas ou prefixos que são públicos (além do login, se houver)
  const isPublicRoute =
    isAuthRoute ||
    nextUrl.pathname === "/register" ||
    nextUrl.pathname.startsWith("/");

  // 1. Se estiver deslogado e tentar acessar uma rota privada, vai para o login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 2. Se estiver logado e tentar ir para o login, redireciona de acordo com o vínculo da empresa
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(
      new URL(hasCompany ? "/dashboard" : "/create-company", nextUrl),
    );
  }

  // 3. Se estiver logado, mas não tiver empresa cadastrada e tentar acessar o dashboard
  if (isLoggedIn && !hasCompany && nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/create-company", nextUrl));
  }

  return NextResponse.next();
});

// Impede que o middleware rode em arquivos de imagem, css ou scripts internos do Next
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
