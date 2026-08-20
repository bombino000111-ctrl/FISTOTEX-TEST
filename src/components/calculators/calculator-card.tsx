import Link from "next/link";
import { ArrowRight, TrendingUp, Calculator, ShieldCheck, PiggyBank, Landmark, ChartBar } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Calculator,
  ShieldCheck,
  PiggyBank,
  Landmark,
  ChartBar,
};

interface CalculatorCardProps {
  calculator: {
    id: string;
    name: string;
    description: string;
    icon: string;
    path: string;
  };
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const IconComponent = iconMap[calculator.icon] || Calculator;

  return (
    <Link
      href={calculator.path}
      className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80 transition-colors">
            {calculator.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {calculator.description}
          </p>
        </div>
      </div>
      <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
        Calculate
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
