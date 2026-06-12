import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface Props extends React.ComponentProps<"input"> {
  label?: string;
  colorFocus?: string;
}

export const AppInput = ({
  label,
  type,
  colorFocus = "focus:border-blue-500",
  ...rest
}: Props) => {
  return (
    <Field className="flex flex-col gap-1">
      {label && (
        <FieldLabel className="font-semibold text-blue-800">{label}</FieldLabel>
      )}
      <Input
        className={`w-91 h-9 border border-zinc-400 rounded-xl p-1 outline-none focus:border-2 ${colorFocus}`}
        type={type}
        {...rest}
      />
    </Field>
  );
};
