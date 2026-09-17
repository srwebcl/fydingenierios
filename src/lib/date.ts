/**
 * Las fechas de sesión (startDate/endDate) se guardan como fecha-calendario
 * (medianoche UTC), no como un instante. Formatearlas con los getters locales
 * de Date corre el riesgo de mostrar el día anterior para zonas horarias con
 * offset negativo (ej. Chile). Esta función reconstruye la fecha usando los
 * componentes UTC como si fueran locales, para que el día mostrado sea
 * siempre el que se guardó, sin importar la zona horaria del que la ve.
 */
export function toDateOnly(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
