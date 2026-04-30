import escudo from "@/assets/escudo-udec-placeholder.png";
import { cn } from "@/lib/utils";

interface InstitutionalLogoProps {
  size?: number;
  className?: string;
  withRing?: boolean;
}

/**
 * Marca institucional reutilizable.
 * Slot pensado para reemplazar el escudo placeholder por el escudo oficial de la
 * Universidad de Cartagena cuando este disponible.
 */
export function InstitutionalLogo({ size = 40, className, withRing = false }: InstitutionalLogoProps) {
  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center",
        withRing && "rounded-full ring-1 ring-accent/40 bg-primary/5 p-1.5",
        className
      )}
      style={{ width: size, height: size }}
      aria-label="Escudo Universidad de Cartagena"
    >
      <img
        src={escudo}
        alt="Escudo Universidad de Cartagena"
        width={size}
        height={size}
        loading="lazy"
        className="object-contain w-full h-full"
      />
    </div>
  );
}
