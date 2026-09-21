import { IProduct, IVariant } from '../types/store';
import { formatPKR } from './formatters';

export function cleanWhatsAppNumber(num: string): string {
  // Remove +, spaces, dashes, parentheses
  return num.replace(/[^\d]/g, '');
}

export function buildWhatsAppInquiryUrl(
  product: IProduct,
  variant: IVariant,
  quantity: number = 1,
  whatsappNumber: string
): string {
  const number = cleanWhatsAppNumber(whatsappNumber);
  const unitPrice = product.basePrice + (variant.additionalPrice || 0);
  const totalPrice = unitPrice * quantity;

  const message = `Assalam-o-Alaikum,

I want to order:
Product: ${product.name}
Product Code: ${product.sku}
Variant Code: ${variant.sku}
Color: ${variant.color}
Size: ${variant.size}
Quantity: ${quantity}
Price: ${formatPKR(totalPrice)}

Please confirm my order and let me know about delivery details.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductQuestionWhatsAppUrl(
  product: IProduct,
  whatsappNumber: string
): string {
  const number = cleanWhatsAppNumber(whatsappNumber);
  const message = `Assalam-o-Alaikum,

I have an inquiry regarding:
Product: ${product.name}
Product Code: ${product.sku}
Fabric: ${product.fabric}

Could you please provide more details?`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildOrderConfirmationWhatsAppUrl(
  orderNumber: string,
  customerName: string,
  totalAmount: number,
  itemCount: number,
  whatsappNumber: string
): string {
  const number = cleanWhatsAppNumber(whatsappNumber);
  const message = `Assalam-o-Alaikum,

I have placed a Cash on Delivery order on your website.
Order Number: ${orderNumber}
Customer Name: ${customerName}
Items: ${itemCount} piece(s)
Total Amount: ${formatPKR(totalAmount)}
Payment Method: Cash on Delivery (COD)

Please confirm my order and let me know the tracking update. Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralSupportWhatsAppUrl(
  brandName: string,
  whatsappNumber: string
): string {
  const number = cleanWhatsAppNumber(whatsappNumber);
  const message = `Assalam-o-Alaikum,

I would like to inquire about ${brandName} collections and nationwide delivery.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
