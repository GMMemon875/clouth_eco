import React from 'react';
import { X, Printer, Package, Phone, MapPin } from 'lucide-react';
import { IOrder } from '../../types/store';

interface PackingSlipModalProps {
  order: IOrder;
  onClose: () => void;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col my-auto print:border-0 print:shadow-none print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-200 bg-stone-50 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <Printer className="w-4 h-4 text-[#8b3a42]" />
            <span>Courier Dispatch Slip / Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-action-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div id="printable-packing-slip" className="p-8 text-stone-900 font-sans space-y-6 bg-white">
          {/* Brand & Header */}
          <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4">
            <div>
              <h1 className="font-serif text-2xl font-black tracking-wider text-stone-900">
                NOOR & CO.
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8b3a42]">
                Pakistani Couture & Formals
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Lahore / Karachi, Pakistan • +92 300 1234567
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-stone-900 text-white font-mono font-bold text-xs rounded mb-1">
                COD SHIPMENT
              </span>
              <p className="text-xs font-mono font-bold text-stone-900">#{order.orderNumber}</p>
              <p className="text-[11px] text-stone-500">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>

          {/* Courier & COD Highlight Badge */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Payment Collection Mode
              </p>
              <p className="text-base font-black text-[#8b3a42] mt-0.5">
                CASH ON DELIVERY (COD)
              </p>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                Collect: <span className="font-bold text-stone-900">Rs. {order.totalAmount.toLocaleString()}</span>
              </p>
            </div>
            <div className="border-l border-stone-200 pl-4">
              <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Courier Tracking Number
              </p>
              <p className="text-sm font-mono font-bold text-stone-900 mt-0.5">
                {order.trackingCode || 'ASSIGN_ON_DISPATCH'}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">Carrier: TCS / Leopards Courier</p>
            </div>
          </div>

          {/* Consignee / Delivery Address */}
          <div className="border border-stone-200 rounded-xl p-4 space-y-1">
            <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              Consignee (Customer Details)
            </p>
            <p className="text-sm font-bold text-stone-900">{order.shippingDetails.fullName}</p>
            <p className="text-xs text-stone-700 leading-relaxed">
              {order.shippingDetails.address}
              {order.shippingDetails.area && `, ${order.shippingDetails.area}`}
            </p>
            <p className="text-xs font-bold text-stone-900">
              {order.shippingDetails.city}, Pakistan
            </p>
            <p className="text-xs font-medium text-stone-800 pt-1">
              Phone: {order.shippingDetails.phone}
              {order.shippingDetails.whatsapp && ` | WA: ${order.shippingDetails.whatsapp}`}
            </p>
            {order.shippingDetails.notes && (
              <p className="text-[11px] text-stone-600 italic pt-1">
                Instructions: {order.shippingDetails.notes}
              </p>
            )}
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-900 font-bold text-stone-800">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2 text-center">Color / Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-medium text-stone-900 max-w-[200px]">
                      {item.productName}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-stone-500">{item.variantSku}</td>
                    <td className="py-2.5 text-center text-stone-700">
                      {item.color} / {item.size}
                    </td>
                    <td className="py-2.5 text-center font-bold text-stone-900">{item.quantity}</td>
                    <td className="py-2.5 text-right font-medium text-stone-900">
                      Rs. {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="border-t-2 border-stone-900 pt-3 flex justify-between items-start text-xs">
            <div className="text-[10px] text-stone-500 max-w-xs space-y-1">
              <p>• Please open the package only after cash payment to the rider.</p>
              <p>• 7-day hassle-free exchange policy via WhatsApp customer support.</p>
            </div>
            <div className="w-48 space-y-1 text-right">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery:</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `Rs. ${order.deliveryCharge.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-300">
                <span>Total Due:</span>
                <span className="text-[#8b3a42]">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs border-t border-stone-200">
            <div>
              <p className="border-t border-stone-400 pt-1 text-stone-500">
                Checked & Packed By: Noor & Co. Quality Control
              </p>
            </div>
            <div className="text-right">
              <p className="border-t border-stone-400 pt-1 text-stone-500">
                Receiver Signature & Date
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
