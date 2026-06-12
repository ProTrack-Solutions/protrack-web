"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppInput } from "@/components/AppInput";
import { AppButton } from "@/components/AppButton";

export default function Auth() {
  //const { setHasCompany } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMostrarSenha(!mostrarSenha);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      /**const response = await login({
        email,
        password,
        aud,
      });*/

      /** localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("has_company", String(response.has_company));
      setHasCompany(response.has_company);*/

      router.push("/dashboard");
    } catch {
      setError("Email ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

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
            <strong className="text-3xl bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent">
              Pro Track
            </strong>
            <span className="text-zinc-500 font-semibold">
              Otimize sua empresa com nosso sistema de gestão: eficiência,
              controle e crescimento garantidos!
            </span>
          </div>
        </div>
      </div>
      <div className="bg-transparent w-133 flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <strong className="text-3xl text-blue-800">Bem vindo!</strong>
            <span className="text-sm text-zinc-500">
              Insira suas credenciais para acessar sua conta.
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-1">
            <AppInput
              label="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <AppInput
              label="Senha"
              type={mostrarSenha ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  className="border-2 rounded-sm"
                  checked={mostrarSenha}
                  onCheckedChange={handleCheckboxChange}
                />
                <span className="text-[#16164D] font-semibold text-sm">
                  Mostrar senha
                </span>
              </label>

              <span
                className="text-blue-600 font-semibold cursor-pointer text-sm"
                onClick={() => router.push("/confirmacaoemail")}
              >
                Esqueceu a senha?
              </span>
            </div>
            <AppButton
              text="Entrar"
              type="submit"
              isLoading={isLoading}
              className="w-1/1 h-10 bg-blue-500 cursor-pointer"
            />
            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
