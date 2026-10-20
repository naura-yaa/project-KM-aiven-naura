"use client";

import { Star, Flame, Plus } from "lucide-react";
import { MenuItem } from "@/app/types";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 flex flex-col justify-between relative group">
      {item.isPromo && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-sm">
          PROMO HEMAT
        </span>
      )}

      <div className="-mt-16 mb-2 flex justify-center relative">
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-50 group-hover:scale-105 transition-transform duration-300">
          <img
            src={
              item.gambarUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
            }
            alt={item.nama}
            className="w-full h-full object-cover"
          />
        </div>
        {!item.isPromo && (
          <span className="absolute top-0 right-8 bg-white/90 backdrop-blur-md text-[11px] p-1.5 rounded-full shadow-sm text-orange-500">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
          </span>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
            {item.kategori}
          </span>
          <div className="flex items-center text-yellow-400 text-xs font-bold gap-0.5">
            <Star className="w-3 h-3 fill-yellow-400" />
            <span className="text-gray-700 text-[11px]">4.9</span>
          </div>
        </div>

        <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-1">
          {item.nama}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-[32px]">
          {item.deskripsi || "Olahan lezat spesial dari KuyMakan."}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <div>
          {item.isPromo && item.hargaCoret ? (
            <>
              <span className="text-[10px] text-gray-400 line-through block">
                Rp {item.hargaCoret.toLocaleString("id-ID")}
              </span>
              <span className="text-base font-black text-red-600">
                Rp {Number(item.harga).toLocaleString("id-ID")}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-gray-400 block font-semibold">
                Harga
              </span>
              <span className="text-base font-black text-gray-900">
                Rp {Number(item.harga).toLocaleString("id-ID")}
              </span>
            </>
          )}
        </div>

        <button
          onClick={() => onAddToCart(item)}
          className="w-10 h-10 bg-orange-500 hover:bg-orange-600 active:scale-90 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md shadow-orange-200 transition-transform cursor-pointer"
          title="Tambah ke Keranjang"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}