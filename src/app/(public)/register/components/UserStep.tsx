import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { inputClass, labelClass, onlyDigits } from "../constants";
import { UserData } from "@/interfaces/auth.interface";

interface UserStepProps {
  user: UserData;
  setUser: (user: UserData) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export default function UserStep({
  user,
  setUser,
  showPassword,
  setShowPassword,
}: UserStepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className={labelClass}>Nome completo</Label>
        <Input
          placeholder="Digite o nome completo"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className={labelClass}>Usuário</Label>
          <Input
            placeholder="Ex: joao.silva"
            value={user.username}
            onChange={(e) =>
              setUser({
                ...user,
                username: e.target.value.toLowerCase().replace(/\s/g, "."),
              })
            }
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>CPF</Label>
          <Input
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
            value={user.document}
            onChange={(e) =>
              setUser({ ...user, document: onlyDigits(e.target.value) })
            }
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className={labelClass}>Email</Label>
        <Input
          type="email"
          placeholder="nome@email.com"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <Label className={labelClass}>Senha</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Crie uma senha segura"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="h-11 bg-muted/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className={labelClass}>Confirmar senha</Label>
        <Input
          type={showPassword ? "text" : "password"}
          value={user.confirmPassword}
          onChange={(e) =>
            setUser({ ...user, confirmPassword: e.target.value })
          }
          className={inputClass}
        />
      </div>
    </div>
  );
}
