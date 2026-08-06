import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { estados, inputClass, labelClass, onlyDigits } from "../constants";
import { CompanyData } from "@/interfaces/auth.interface";

interface CompanyStepProps {
  company: CompanyData;
  setCompany: (company: CompanyData) => void;
}

export default function CompanyStep({ company, setCompany }: CompanyStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className={labelClass}>Razão social</Label>
          <Input
            placeholder="Digite aqui"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Nome fantasia</Label>
          <Input
            placeholder="Digite aqui"
            value={company.trade_name}
            onChange={(e) =>
              setCompany({ ...company, trade_name: e.target.value })
            }
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>CNPJ</Label>
          <Input
            placeholder="Digite aqui"
            inputMode="numeric"
            maxLength={18}
            value={company.document}
            onChange={(e) =>
              setCompany({ ...company, document: onlyDigits(e.target.value) })
            }
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Telefone</Label>
          <Input
            placeholder="Digite aqui"
            inputMode="numeric"
            value={company.phone}
            onChange={(e) =>
              setCompany({ ...company, phone: onlyDigits(e.target.value) })
            }
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>E-mail</Label>
          <Input
            type="email"
            placeholder="Digite aqui"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Website</Label>
          <Input
            placeholder="Digite aqui"
            value={company.website}
            onChange={(e) =>
              setCompany({ ...company, website: e.target.value })
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-bold text-blue-950 mb-3">Endereço</h3>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label className={labelClass}>Rua</Label>
            <Input
              placeholder="Digite aqui"
              value={company.address_street}
              onChange={(e) =>
                setCompany({ ...company, address_street: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Número</Label>
            <Input
              placeholder="Digite aqui"
              value={company.address_number}
              onChange={(e) =>
                setCompany({ ...company, address_number: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Complemento</Label>
            <Input
              placeholder="Digite aqui"
              value={company.address_complement}
              onChange={(e) =>
                setCompany({ ...company, address_complement: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Bairro</Label>
            <Input
              placeholder="Digite aqui"
              value={company.address_neighborhood}
              onChange={(e) =>
                setCompany({ ...company, address_neighborhood: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>CEP</Label>
            <Input
              placeholder="Digite aqui"
              inputMode="numeric"
              maxLength={9}
              value={company.address_zipcode}
              onChange={(e) =>
                setCompany({
                  ...company,
                  address_zipcode: onlyDigits(e.target.value),
                })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className={labelClass}>Cidade</Label>
            <Input
              placeholder="Digite aqui"
              value={company.address_city}
              onChange={(e) =>
                setCompany({ ...company, address_city: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Estado</Label>
            <Select
              value={company.address_state}
              onValueChange={(v) =>
                setCompany({ ...company, address_state: v })
              }
            >
              <SelectTrigger className="h-11 bg-muted/50">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {estados.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>País</Label>
            <Select
              value={company.address_country}
              onValueChange={(v) =>
                setCompany({ ...company, address_country: v })
              }
            >
              <SelectTrigger className="h-11 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BR">Brasil (BR)</SelectItem>
                <SelectItem value="PT">Portugal (PT)</SelectItem>
                <SelectItem value="US">Estados Unidos (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className={labelClass}>Fuso horário</Label>
            <Select
              value={company.timezone}
              onValueChange={(v) => setCompany({ ...company, timezone: v })}
            >
              <SelectTrigger className="h-11 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">
                  America/Sao_Paulo
                </SelectItem>
                <SelectItem value="America/Manaus">America/Manaus</SelectItem>
                <SelectItem value="America/Belem">America/Belem</SelectItem>
                <SelectItem value="America/Cuiaba">America/Cuiaba</SelectItem>
                <SelectItem value="America/Rio_Branco">
                  America/Rio_Branco
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
