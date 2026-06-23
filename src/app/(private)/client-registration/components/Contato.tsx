import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { ClienteFormData } from "@/@types/client-registration.type";

interface ContatoProps {
  formData: ClienteFormData;
  onChange: (field: keyof ClienteFormData, value: string) => void;
}

export function Contato({ formData, onChange }: ContatoProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Contato</h2>
            <p className="text-xs text-muted-foreground">
              Telefones e email para comunicação
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="whatsapp"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              placeholder="(00) 00000-0000"
              value={formData.whatsapp}
              onChange={(e) => onChange("whatsapp", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile_phone" className="text-sm font-medium">
              Celular
            </Label>
            <Input
              id="mobile_phone"
              placeholder="(00) 00000-0000"
              value={formData.mobile_phone}
              onChange={(e) => onChange("mobile_phone", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home_phone" className="text-sm font-medium">
              Telefone fixo
            </Label>
            <Input
              id="home_phone"
              placeholder="(00) 0000-0000"
              value={formData.home_phone}
              onChange={(e) => onChange("home_phone", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              Email <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
