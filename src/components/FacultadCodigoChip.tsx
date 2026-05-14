import { getColorFacultad } from "@/lib/codificacion";

interface Props {
  facultad: string;
  codigo?: string;
  size?: "sm" | "md";
}

/** Chip institucional: Facultad (oscuro) + Codigo (claro) en la misma paleta. */
export function FacultadCodigoChip({ facultad, codigo, size = "sm" }: Props) {
  const c = getColorFacultad(facultad);
  const padY = size === "md" ? "py-1" : "py-0.5";
  const text = size === "md" ? "text-xs" : "text-[10px]";
  return (
    <span className={`inline-flex items-stretch rounded overflow-hidden font-body ${text} shadow-sm`}>
      <span
        className={`px-2 ${padY} font-medium tracking-wide`}
        style={{ backgroundColor: c.dark, color: "#FFFFFF" }}
        title={facultad}
      >
        {facultad}
      </span>
      {codigo && (
        <span
          className={`px-2 ${padY} font-mono`}
          style={{ backgroundColor: c.light, color: c.text }}
        >
          {codigo}
        </span>
      )}
    </span>
  );
}

/** Solo el chip oscuro de Facultad. */
export function FacultadChip({ facultad }: { facultad: string }) {
  const c = getColorFacultad(facultad);
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[10px] font-body font-medium tracking-wide"
      style={{ backgroundColor: c.dark, color: "#FFFFFF" }}
    >
      {facultad}
    </span>
  );
}
