"use client";

import { QRCodeSVG } from "qrcode.react";
import { QrCode, Calendar, Clock } from "lucide-react";
import { OrderHistory } from "@/app/types";

interface OrderDetailProps {
  order: OrderHistory;
  onClose: () => void;
}

export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl relative animate-in fade-in zoom-in duration-200">
      <div className="text-center">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-gray-900">Tunjukkan ke Kasir</h3>
        <p className="text-xs text-gray-500 mt-1">
          Silakan tunjukkan Kode QR ini di kasir toko <strong className="text-orange-600">KuyMakan</strong> untuk melakukan pembayaran.
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl my-6 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            <strong>Waktu Pesan:</strong> {order.waktuPesan}
          </span>
        </div>
        <div className="flex items-center gap-2 text-red-600 font-bold">
          <Clock className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            Maksimal diambil sebelum jam <u>{order.batasWaktu}</u> (Batas 1 Jam)
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-orange-200 mb-6 flex flex-col items-center justify-center">
        <QRCodeSVG value={order.orderCode} size={180} />
        <p className="text-xs text-gray-400 font-mono mt-3">Kode Order:</p>
        <p className="text-xl font-black text-orange-600 tracking-wider font-mono">
          {order.orderCode}
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl text-xs text-gray-700 space-y-2 mb-6">
        <div className="font-bold text-gray-900 mb-2 border-b pb-1 text-sm">
          Hasil Pesanan Makanan:
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-0.5">
            <span>
              {item.qty}x <strong>{item.nama}</strong>
            </span>
            <span className="font-semibold text-gray-900">
              Rp {(item.harga * item.qty).toLocaleString("id-ID")}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-black text-gray-900 pt-3 border-t mt-2 text-base">
          <span>Total Pembayaran:</span>
          <span className="text-orange-600">
            Rp {order.total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-orange-200 cursor-pointer"
      >
        Selesai
      </button>
    </div>
  );
}