import { Accessibility, Eye, Ear, Activity, Brain, AlertCircle } from "lucide-react";
import { CONDICION_ESPECIAL_LABEL, type CondicionEspecial } from "@/lib/codificacion";

const ICONS: Record<CondicionEspecial, typeof Accessibility> = {
  ninguna: Accessibility,
  visual: Eye,
  auditiva: Ear,
  motriz: Activity,
  cognitiva: Brain,
  multiple: Accessibility,
  otra: AlertCircle,
};

interface Props {
  condicion: CondicionEspecial;
  detalle?: string;
  compact?: boolean;
}

export function CondicionEspecialBadge({ condicion, detalle, compact = false }: Props) {
  if (condicion === "ninguna") return null;
  const Icon = ICONS[condicion];
  const label = CONDICION_ESPECIAL_LABEL[condicion];

  if (compact) {
    return (
      <span
        title={detalle ? `${label} — ${detalle}` : label}
        className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-accent/40 bg-accent/10 text-accent"
      >
        <Icon className="h-3 w-3" />
      </span>
    );
  }

  return (
    <span
      title={detalle ?? label}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-accent/40 bg-accent/10 text-accent text-[10px] font-medium font-body"
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </span>
  );
}
