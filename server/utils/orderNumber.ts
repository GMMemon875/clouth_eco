let dailyOrderCounter = 100;

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  dailyOrderCounter += 1;
  const sequence = String(dailyOrderCounter).padStart(5, '0');
  return `LS-${year}${month}${day}-${sequence}`;
}
