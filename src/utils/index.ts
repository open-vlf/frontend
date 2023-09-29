export function noZoneDate(dateString: string): Date {
  const zonedDate = new Date(dateString)
  return new Date(zonedDate.toISOString().slice(0, -1))
}
