import { Suspense } from "react";

import { ResetPasswordForm } from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center gap-10">
      <div
        className="bg-no-repeat bg-cover bg-center h-screen w-133 flex items-center justify-center"
        style={{ backgroundImage: `url('/mesh-gradient.svg')` }}
      >
        <div className="flex w-100 h-90 bg-zinc-400/30 rounded-2xl justify-center items-center">
          <div className="flex flex-col w-87 h-48 space-y-2">
            <strong className="text-3xl text-blue-800">
              Sistema de gestão empresarial
            </strong>
            <strong className="text-3xl bg-linear-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent">
              Pro Track
            </strong>
            <span className="text-zinc-500 font-semibold">
              Otimize sua empresa com nosso sistema de gestão: eficiência,
              controle e crescimento garantidos!
            </span>
          </div>
        </div>
      </div>
      <div className="bg-transparent w-110 flex justify-center items-center">
        <div className="flex-1 flex-col gap-2 p-10">
          <div className="flex flex-col">
            <strong className="text-3xl text-blue-800">
              Redefinir senha
            </strong>
            <span className="text-sm text-zinc-500">
              Escolha uma nova senha para acessar sua conta.
            </span>
          </div>
          <Suspense
            fallback={
              <p className="mt-4 text-sm text-zinc-500">Carregando...</p>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
