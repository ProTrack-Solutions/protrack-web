import { Button } from "../ui/button";

interface Props extends React.ComponentProps<"button"> {
  text: string;
  isLoading: boolean;
}

export const AppButton = ({ text, isLoading, ...rest }: Props) => {
  return (
    <Button type="submit" disabled={isLoading} {...rest}>
      {text}
    </Button>
  );
};
