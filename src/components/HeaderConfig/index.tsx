interface Props {
  title: string;
  description: string;
}

export const HeaderConfig = ({ title, description }: Props) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
