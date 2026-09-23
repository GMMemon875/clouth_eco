export function formatPKR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function calculateDiscountPercent(basePrice: number, compareAtPrice?: number | null): number {
  if (!compareAtPrice || compareAtPrice <= basePrice) return 0;
  const discount = ((compareAtPrice - basePrice) / compareAtPrice) * 100;
  return Math.round(discount);
}

export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'N/A';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

