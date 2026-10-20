"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Receipt,
  Tag,
  LogOut,
  ShoppingBag,
  Search,
  Minus,
  Plus,
  X,
  UtensilsCrossed,
  ArrowLeft,
  QrCode,
  Calendar,
  Bell,
} from "lucide-react";

import { MenuItem, CartItem, OrderHistory, User } from "@/app/types";
import { defaultMenuList } from "@/app/data/defaultMenu";
import AuthForm from "@/app/components/AuthForm";
import MenuCard from "@/app/components/MenuCard";
import OrderDetail from "@/app/components/OrderDetail";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [menuList, setMenuList] = useState<MenuItem[]>(defaultMenuList);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Selamat Datang!", pesan: "Nikmati kemudahan pesan makanan tanpa antre di KuyMakan.", waktu: "Baru saja" },
    { id: 2, title: "Promo Spesial 🔥", pesan: "Dapatkan diskon menarik untuk menu Dimsum & Samyang hari ini.", waktu: "1 jam lalu" }
  ]);

  const [activeOrder, setActiveOrder] = useState<OrderHistory | null>(null);
  const [orderHistoryList, setOrderHistoryList] = useState<OrderHistory[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("kuymakan_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    setIsAuthChecking(false);
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMenuList(data);
      } else {
        setMenuList(defaultMenuList);
      }
    } catch {
      setMenuList(defaultMenuList);
    }
  };

  const handleLoginSuccess = (userObj: User) => {
    setCurrentUser(userObj);
    setIsLoggedIn(true);
    localStorage.setItem("kuymakan_user", JSON.stringify(userObj));
  };

  const handleLogout = () => {
    localStorage.removeItem("kuymakan_user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
    setShowCartDrawer(false);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        return prevCart.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      } else {
        return [
          ...prevCart,
          {
            id: item.id,
            nama: item.nama,
            harga: Number(item.harga),
            gambarUrl: item.gambarUrl,
            qty: 1,
          },
        ];
      }
    });
  };

  const handleUpdateQty = (id: string | number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const randomCode = "KM-" + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();

    const optionsDate: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const waktuFormatted = now.toLocaleDateString("id-ID", optionsDate) + " WIB";

    const limitDate = new Date(now.getTime() + 60 * 60 * 1000);
    const batasFormatted =
      limitDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";

    const newOrder: OrderHistory = {
      id: Date.now().toString(),
      orderCode: randomCode,
      items: [...cart],
      total: totalPrice,
      waktuPesan: waktuFormatted,
      batasWaktu: batasFormatted,
    };

    setOrderHistoryList((prev) => [newOrder, ...prev]);
    setCart([]);
    setShowCartDrawer(false);

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Pesanan Dibuat 🎉",
        pesan: `Kode Order ${randomCode} berhasil dibuat. Silakan bayar ke kasir.`,
        waktu: "Baru saja"
      },
      ...prev
    ]);

    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setActiveNav("pesanan");
    setActiveOrder(null);
  };

  const categories = ["Semua", "Snack", "Makanan", "Dessert", "Minuman"];

  const filteredMenu = menuList.filter((item) => {
    const matchCategory =
      activeCategory === "Semua" || item.kategori === activeCategory;
    const matchSearch = item.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const promoMenu = menuList.filter((item) => item.isPromo);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-400 font-bold text-sm">Memuat KuyMakan...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-800 font-sans overflow-x-hidden">
      {/* SIDEBAR KIRI */}
      <aside
        className={`bg-white border-r border-gray-100 flex flex-col justify-between py-6 sticky top-0 h-screen z-30 transition-all duration-300 hidden md:flex ${
          showCartDrawer ? "w-20 px-3" : "w-64 px-6"
        }`}
      >
        <div>
          <div
            className={`flex items-center mb-10 ${
              showCartDrawer ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-md shadow-orange-200 shrink-0">
              KM
            </div>
            {!showCartDrawer && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-lg font-black text-gray-900 leading-tight">
                  KuyMakan
                </h1>
                <p className="text-[10px] text-gray-400 font-bold tracking-wider">
                  {currentUser?.nama ? `Halo, ${currentUser.nama}` : "FOOD ORDER"}
                </p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveNav("home");
                setActiveOrder(null);
              }}
              className={`w-full flex items-center rounded-2xl text-xs font-bold transition cursor-pointer ${
                showCartDrawer
                  ? "justify-center py-3.5 px-0"
                  : "space-x-3 px-4 py-3"
              } ${
                activeNav === "home" && !activeOrder
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Home className="w-5 h-5 shrink-0" />
              {!showCartDrawer && <span>Home</span>}
            </button>

            <button
              onClick={() => {
                setActiveNav("pesanan");
                setActiveOrder(null);
              }}
              className={`w-full flex items-center rounded-2xl text-xs font-bold transition cursor-pointer ${
                showCartDrawer
                  ? "justify-center py-3.5 px-0"
                  : "space-x-3 px-4 py-3"
              } ${
                activeNav === "pesanan" || activeOrder
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Receipt className="w-5 h-5 shrink-0" />
              {!showCartDrawer && <span>Pesanan</span>}
            </button>

            <button
              onClick={() => {
                setActiveNav("promo");
                setActiveOrder(null);
              }}
              className={`w-full flex items-center rounded-2xl text-xs font-bold transition cursor-pointer ${
                showCartDrawer
                  ? "justify-center py-3.5 px-0"
                  : "space-x-3 px-4 py-3"
              } ${
                activeNav === "promo" && !activeOrder
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Tag className="w-5 h-5 shrink-0" />
              {!showCartDrawer && <span>Promo</span>}
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 transition cursor-pointer ${
            showCartDrawer
              ? "justify-center py-3.5 px-0"
              : "space-x-3 px-4 py-3"
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!showCartDrawer && <span>Logout</span>}
        </button>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {activeOrder && (
              <button
                onClick={() => setActiveOrder(null)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-700 transition cursor-pointer"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-black text-gray-900 capitalize">
              {activeOrder
                ? "Detail Pesanan & Kode QR"
                : activeNav === "home"
                ? "Daftar Menu Spesial"
                : activeNav === "pesanan"
                ? "Daftar Pesanan Kamu"
                : "Menu Diskon & Promo Special"}
            </h2>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition cursor-pointer relative"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h4 className="font-extrabold text-xs text-gray-900">Notifikasi Terbaru</h4>
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                      {notifications.length} Pesan
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-xs text-gray-900">{notif.title}</h5>
                          <span className="text-[9px] text-gray-400">{notif.waktu}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                          {notif.pesan}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCartDrawer(!showCartDrawer)}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-orange-200 cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Keranjang</span>
              {totalItemCount > 0 && (
                <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-[11px] font-black ml-1">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="p-6 w-full mx-auto pb-24">
          {activeOrder ? (
            <OrderDetail
              order={activeOrder}
              onClose={() => setActiveOrder(null)}
            />
          ) : (
            <>
              {activeNav === "home" && (
                <>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-100 mb-8 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 max-w-md">
                      <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        KuyMakan Self-Order
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black mt-2 leading-snug">
                        Mau Makan Apa Hari Ini?
                      </h2>
                      <p className="text-orange-100 text-xs sm:text-sm mt-1">
                        Pilih makanan favoritmu, lalu tunjukkan Kode QR di kasir untuk pembayaran!
                      </p>
                    </div>
                    <UtensilsCrossed className="w-32 h-32 absolute -right-4 -bottom-4 text-white/10 select-none" />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                            activeCategory === cat
                              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                              : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari menu makanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs bg-white text-gray-900 focus:outline-orange-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {filteredMenu.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                      <p className="text-gray-400 font-medium text-sm">
                        Menu makanan tidak ditemukan.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16 pt-8">
                      {filteredMenu.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeNav === "pesanan" && (
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-4">
                    Daftar Kode QR Pesanan Aktif
                  </h3>

                  {orderHistoryList.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm py-16">
                      <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-800 text-base">Belum Ada Pesanan</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Pesanan yang baru kamu checkout akan muncul di sini beserta Kode QR-nya!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orderHistoryList.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                              <span className="text-xs font-bold text-orange-600 font-mono">
                                {order.orderCode}
                              </span>
                              <span className="text-[10px] bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-bold">
                                Tunjukkan ke Kasir
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {order.waktuPesan}
                            </p>

                            <div className="text-xs text-gray-700 space-y-1 mb-4">
                              {order.items.map((it) => (
                                <div key={it.id} className="flex justify-between">
                                  <span>
                                    {it.qty}x {it.nama}
                                  </span>
                                  <span className="font-semibold">
                                    Rp {(it.harga * it.qty).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-3 flex justify-between items-center">
                            <div>
                              <span className="text-[10px] text-gray-400 block">Total</span>
                              <span className="text-sm font-black text-gray-900">
                                Rp {order.total.toLocaleString("id-ID")}
                              </span>
                            </div>

                            <button
                              onClick={() => setActiveOrder(order)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>Lihat QR Code</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeNav === "promo" && (
                <div>
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-100 mb-8 flex justify-between items-center relative overflow-hidden">
                    <div>
                      <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        Promo Heboh 🔥
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black mt-2">
                        Diskon Spesial Hari Ini!
                      </h2>
                      <p className="text-orange-100 text-xs sm:text-sm mt-1">
                        Dapatkan harga hemat untuk jajanan favoritmu sebelum kehabisan!
                      </p>
                    </div>
                    <Tag className="w-32 h-32 absolute -right-4 -bottom-4 text-white/10 select-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16 pt-8">
                    {promoMenu.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* PANEL KERANJANG SISI KANAN */}
      {showCartDrawer && (
        <aside className="w-80 md:w-96 bg-white border-l border-gray-100 flex flex-col justify-between p-6 sticky top-0 h-screen z-20 shrink-0 shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-extrabold text-gray-900">Order Summary</h3>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold text-sm">Keranjang Masih Kosong</p>
                <p className="text-xs text-gray-400 mt-1">
                  Pilih menu makanan favoritmu!
                </p>
              </div>
            ) : (
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1 space-y-3.5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.gambarUrl}
                        alt={item.nama}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{item.nama}</h4>
                        <p className="text-xs text-orange-600 font-extrabold">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-xs">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="text-gray-500 hover:text-orange-600 font-bold text-sm cursor-pointer px-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-extrabold text-xs text-gray-900 w-3 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="text-gray-500 hover:text-orange-600 font-bold text-sm cursor-pointer px-1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-3 bg-white">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal Item ({totalItemCount}):</span>
                <span className="font-bold text-gray-800">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900">
                <span>Total Bayar:</span>
                <span className="text-orange-600 text-base">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xs transition shadow-lg shadow-orange-200 cursor-pointer"
              >
                Checkout & Dapatkan Kode QR
              </button>
            </div>
          )}
        </aside>
      )}

      {/* POP-UP MODAL PEMBAYARAN BERHASIL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
              🎉
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Pesanan Berhasil!
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Yeay! Pesanan kamu berhasil dibuat. Silakan cek Kode QR pembayaran di halaman Pesanan ya.
            </p>
            <button
              onClick={handleCloseModal}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 rounded-2xl text-xs transition shadow-lg shadow-orange-200 cursor-pointer"
            >
              Lihat Kode QR di Pesanan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}