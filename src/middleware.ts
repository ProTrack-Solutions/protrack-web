import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInitialRoute } from "@/const/moduleAccess.const";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const hasCompany = req.auth?.hasCompany;
  const { nextUrl } = req;

  // Define se o usuário está tentando acessar a página de login
  const isAuthRoute = nextUrl.pathname === "/login";
  const isRoot = nextUrl.pathname === "/";

  // Lista de páginas ou prefixos que são públicos (além do login, se houver)
  const isPublicRoute =
    isAuthRoute ||
    nextUrl.pathname === "/register" ||
    isRoot ||
    nextUrl.pathname === "/forgot-password" ||
    nextUrl.pathname === "/reset-password";

  // 1. Se estiver deslogado e tentar acessar uma rota privada, vai para o login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 2. Se estiver logado e tentar ir para o login (ou cair na raiz), manda
  // para a tela inicial do departamento do usuário, não sempre /dashboard.
  if (isLoggedIn && (isAuthRoute || isRoot)) {
    const initialRoute = getInitialRoute({
      role: req.auth?.role,
      modules: req.auth?.modules,
    });
    return NextResponse.redirect(new URL(initialRoute, nextUrl));
  }

  // // 3. Se estiver logado, mas não tiver empresa cadastrada e tentar acessar o dashboard
  // if (isLoggedIn && !hasCompany && nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/create-company", nextUrl));
  // }

  return NextResponse.next();
});

// Impede que o middleware rode em arquivos de imagem, css ou scripts internos do Next
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
