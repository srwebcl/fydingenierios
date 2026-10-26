// Formatea un monto en pesos chilenos (sin decimales), ej: 1000000 -> "1.000.000"
export function formatCLP(value: number): string {
  return Math.round(Number(value) || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 });
}
