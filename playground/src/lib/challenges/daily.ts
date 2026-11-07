/** Today's challenge, the same for everyone on the same calendar day. */
export function dailyIndex(count: number, date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return day % count;
}
