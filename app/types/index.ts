export interface MenuItem {
  id: string | number;
  nama: string;
  kategori: string;
  harga: number;
  deskripsi?: string;
  gambarUrl: string;
  isPromo?: boolean;
  hargaCoret?: number;
}

export interface CartItem {
  id: string | number;
  nama: string;
  harga: number;
  gambarUrl: string;
  qty: number;
}

export interface OrderHistory {
  id: string;
  orderCode: string;
  items: CartItem[];
  total: number;
  waktuPesan: string;
  batasWaktu: string;
}

export interface User {
  nama: string;
  email: string;
}