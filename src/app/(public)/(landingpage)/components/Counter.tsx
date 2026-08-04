type CounterProps = {
  to: number;
  suffix?: string;
};

export function Counter({ to, suffix = "" }: CounterProps) {
  return (
    <span>
      {to}
      {suffix}
    </span>
  );
}
