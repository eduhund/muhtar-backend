export function generateUniqueTimestamp() {
  const ts = Date.now();
  const randomFraction = Math.floor(Math.random() * 1000000);
  return `${ts}.${randomFraction.toString().padStart(6, "0")}`;
}
