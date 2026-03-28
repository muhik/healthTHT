'use client';

import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Truck, ArrowRight, Package, Shield, X, AlertTriangle, Activity, Eye, Smartphone, ThumbsUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackPixel } from '@/lib/data';

export default function LandingPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [trackInput, setTrackInput] = useState('');
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput) {
      router.push(`/track?id=${trackInput}`);
    }
  };

  const handleAddToCart = () => {
    setCartCount(1);
    trackPixel('AddToCart', { content_name: 'Paket Pembersih Telinga Pintar', value: 150000, currency: 'IDR' });
    router.push('/checkout');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  }

  const toggleHelpful = (id: number) => {
    setHelpfulReviews(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  // Helper untuk gambar fallback
  const handleImageError = (e: any, type: string) => {
    e.target.onerror = null;
    if (type === 'jelly') {
      e.target.src = "https://placehold.co/200x500/1a1a1a/FFF?text=KOREK+JELLY";
    } else if (type === 'kamera') {
      e.target.src = "https://placehold.co/400x500/0ea5e9/FFF?text=KAMERA+ENDOSCOPE";
    } else if (type === 'bonus') {
      e.target.src = "https://placehold.co/200x200/fbbf24/000?text=BOX+EKSKLUSIF";
    } else {
      e.target.src = "https://placehold.co/400x400?text=Produk+Tidak+Ditemukan";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-slate-200">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
            <Activity className="w-8 h-8 text-slate-700 stroke-[2.5]" />
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">
              THT<span className="text-slate-600">CARE</span>.ID
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('/track')} className="text-sm font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1 transition">
              <Truck className="w-5 h-5" /> Cek Resi
            </button>
            <button onClick={() => navigateTo('/checkout')} className="relative group">
              <ShoppingCart className="w-7 h-7 text-slate-700 group-hover:text-slate-900 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-slate-800 to-slate-700 text-white pt-16 pb-24 px-4 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute right-0 top-0 w-64 h-64 bg-slate-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-500/20 border border-slate-500/50 rounded-full px-4 py-1 mb-6">
            <AlertTriangle className="w-4 h-4 text-slate-300" />
            <span className="text-slate-300 text-xs md:text-sm font-bold tracking-widest uppercase">BAHAYA COTTON BUD - BERALIH KE CARA AMAN!</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            JANGAN BIARKAN KOTORAN TELINGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-100">MERUSAK</span> PENDENGARAN!
          </h2>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Solusi <strong>Cerdas & Aman</strong> membersihkan telinga keluarga. Dilengkapi Kamera HD untuk melihat jelas ke dalam telinga, dan Korek Jelly Lengket yang anti luka!
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleAddToCart}
              className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 text-white font-black py-4 px-8 rounded-xl text-lg shadow-[0_0_20px_rgba(100,116,139,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              AMBIL PROMO SEKARANG <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Truck className="w-5 h-5 text-emerald-400" />
              <span>Gratis Ongkir Seluruh Indonesia</span>
            </div>
          </div>
        </div>
      </header>

      {/* Product Showcase (The Bundle) */}
      <section className="py-16 px-4 max-w-6xl mx-auto -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section - COMPOSITE VIEW */}
            <div className="bg-slate-50/50 p-8 flex flex-col justify-center items-center relative min-h-[400px]">
              {/* Label Promo */}
              <div className="absolute top-6 left-6 z-0 bg-rose-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg rotate-[-2deg]">
                DISKON 50%
              </div>

              {/* KONSEP KOMPOSISI GAMBAR */}
              <div className="flex items-end justify-center w-full max-w-lg transform scale-110 md:scale-100 mt-8">

                {/* 1. JELLY EAR PICK (Kiri Belakang) */}
                <div className="w-1/3 -mr-10 z-10 relative group transition-all duration-300 ease-out hover:z-50 hover:scale-125 cursor-pointer">
                  <img
                    src="/3.korekjelly.jpg"
                    onError={(e) => handleImageError(e, 'jelly')}
                    alt="Korek Kuping Jelly"
                    className="w-full h-auto drop-shadow-2xl rounded-lg border-2 border-white bg-slate-800"
                    onClick={() => setSelectedImage("/3.korekjelly.jpg")}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm -rotate-6">
                    Korek Jelly Lengket
                  </div>
                </div>

                {/* 2. KAMERA ENDOSCOPE (Tengah Depan - Fokus Utama) */}
                <div className="w-2/5 z-30 relative -mb-4 transition-all duration-300 ease-out hover:z-50 hover:scale-125 cursor-pointer">
                  <img
                    src="/2. korekkameraonly.jpg"
                    onError={(e) => handleImageError(e, 'kamera')}
                    alt="Kamera THT Endoscope"
                    className="w-full h-full object-cover drop-shadow-[0_20px_50px_rgba(100,116,139,0.3)] rounded-xl border-4 border-white bg-slate-100"
                    onClick={() => setSelectedImage("/2. korekkameraonly.jpg")}
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                    KAMERA ENDOSCOPE HD
                  </div>
                </div>

                {/* 3. BONUS BOX / ETIKETA (Kanan) */}
                <div className="w-1/3 -ml-8 z-20 mb-8 relative transition-all duration-300 ease-out hover:z-50 hover:scale-125 cursor-pointer">
                  <div className="relative transform rotate-6 hover:rotate-0 transition duration-300">
                    <img
                      src="/BonusPinUkuran.jpg"
                      onError={(e) => handleImageError(e, 'bonus')}
                      alt="Bonus Box Penyimpanan"
                      className="w-full h-auto rounded-xl shadow-xl border-4 border-rose-400 bg-rose-100"
                      onClick={() => setSelectedImage("/BonusPinUkuran.jpg")}
                    />
                    <div className="absolute -top-3 -right-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-md border-2 border-white">
                      GRATIS ONGKIR!
                    </div>
                  </div>
                </div>

              </div>

              <p className="mt-8 text-xs font-bold text-slate-400 tracking-widest uppercase text-center">
                *Gambar Ilustrasi Paket Bundling THT
              </p>
            </div>

            {/* Detail Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-black text-slate-800 mb-2">PEMBERSIH TELINGA PINTAR</h3>
              <p className="text-slate-500 mb-6">Gabungan Kamera HD Telinga & Korek Kuping Jelly Lengket Anti Luka.</p>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-black text-slate-700">Rp 150.000</span>
                <span className="text-xl text-slate-400 line-through mb-1">Rp 299.000</span>
              </div>

              <ul className="space-y-4 mb-4">
                <li className="flex items-start gap-3">
                  <Smartphone className="w-6 h-6 text-slate-500 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-800">1x Kamera Telinga (Endoscope)</strong>
                    <span className="text-sm text-slate-500">Konek langsung ke HP. Lihat kondisi kotoran telinga dengan sangat jelas, tidak meraba-raba lagi.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-slate-500 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-800">1x Korek Kuping Jelly Lengket</strong>
                    <span className="text-sm text-slate-500">Ujung jelly yang lengket mengangkat kotoran keras maupun basah tanpa menggores kulit telinga.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200">
                  <Package className="w-6 h-6 text-slate-600 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-800">BONUS 5 KEPALA PENGGANTI</strong>
                    <span className="text-sm text-slate-600">Untuk membersihkan telinga seluruh keluarga agar tetap higienis dan aman.</span>
                  </div>
                </li>
              </ul>

              {/* Disclaimer */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg mb-8 flex items-start gap-2">
                <Activity className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 leading-relaxed">
                  <strong>Aman Digunakan:</strong> Dirancang khusus untuk meminimalkan risiko iritasi. Jauh lebih aman dibandingkan menggunakan Cotton Bud yang berisiko tertinggal kapas atau mendorong kotoran lebih dalam.
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl text-lg transition shadow-xl shadow-slate-700/20 flex justify-center items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                AMBIL PROMO 150RB SEKARANG
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">🔒 Pembayaran Aman & Bisa COD (Bayar di Tempat)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8 text-slate-800">KERUGIAN PAKAI COTTON BUD VS ALAT PINTAR KAMI</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col h-full">
              <h4 className="font-bold text-red-800 mb-4 text-lg">❌ Cotton Bud / Alat Besi Biasa</h4>
              <ul className="text-left text-sm text-red-700 space-y-3 flex-grow">
                <li className="flex gap-2"><span>⚠️</span> Kotoran justru terdorong semakin dalam ke gendang telinga.</li>
                <li className="flex gap-2"><span>⚠️</span> Risiko kapas tertinggal di dalam rongga telinga.</li>
                <li className="flex gap-2"><span>⚠️</span> Alat besi tanpa kamera berisiko melukai dinding telinga (berdarah).</li>
                <li className="flex gap-2"><span>⚠️</span> Membersihkan secara buta tanpa bisa melihat letak kotoran seutuhnya.</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col h-full ring-2 ring-slate-300">
              <h4 className="font-bold text-slate-800 mb-4 text-lg">✅ Paket Kamera & Jelly THT Care</h4>
              <ul className="text-left text-sm text-slate-700 space-y-3 flex-grow">
                <li className="flex gap-2"><span>✔️</span> <strong>Kamera HD:</strong> Konek layar HP langsung melihat jelas kondisi telinga.</li>
                <li className="flex gap-2"><span>✔️</span> <strong>Jelly Lengket:</strong> Kotoran menempel dan terangkat sempurna, tanpa digaruk.</li>
                <li className="flex gap-2"><span>✔️</span> <strong>Super Aman:</strong> Ujung lembut jelly tidak menimbulkan lecet, cocok bahkan untuk anak-anak.</li>
                <li className="flex gap-2"><span>✔️</span> <strong>Puas & Lega:</strong> Sensasi lega luar biasa saat semua gumpalan kotoran terangkat keluar.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - Order.co.id Style */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <h3 className="text-xl font-bold text-slate-800 mb-6">ULASAN PEMBELI</h3>


          {/* Review Cards */}
          <div className="space-y-4">
            {/* Review 1 - With Seller Reply */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Ahmad D.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">2 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Barang berfungsi dgn baik, cuma packingnya sih kadarnya bgtt. Tapi overall puas banget! Kamera jernih, korek jellynya lengket beneran. Telinga jadi bersih total! 🙌
              </p>

              <div className="flex gap-2 mb-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/2. korekkameraonly.jpg")}>
                  <img src="/2. korekkameraonly.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/3.korekjelly.jpg")}>
                  <img src="/3.korekjelly.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(1)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(1) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(1) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>

              {/* Seller Reply */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border-l-4 border-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-700">THTCARE.ID</span>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">Penjual</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih kak Ahmad atas reviewnya! 🙏 Kami akan perbaiki packagingnya agar lebih aman. Senang mendengar kamera dan korek jellynya berfungsi dengan baik. Selamat menggunakan! 😊
                </p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SB
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Siti B.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">5 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Produknya bagus berfungsi dengan baik. Kamera HDnya benar-benar membantu melihat kotoran di telinga. Akhirnya saya bisa bersihkan telinga anak saya tanpa khawatir. Recommended banget! 👍
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(2)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(2) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(2) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>

              {/* Seller Reply */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border-l-4 border-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-700">THTCARE.ID</span>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">Penjual</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Makasih banyak kak Siti! ❤️ Senang banget produk kami bisa membantu membersihkan telinga si kecil dengan aman. Jangan lupa kasih tau teman-teman ya kak! 🥰
                </p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  RK
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Rudi K.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">1 minggu yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Pengiriman cepat, packing aman. Sudah coba dan hasilnya memuaskan. Telinga bersih total, korek jellynya lengket beneran. Worth it dengan harga segini! ⭐⭐⭐⭐⭐
              </p>

              <div className="flex gap-2 mb-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/BonusPinUkuran.jpg")}>
                  <img src="/BonusPinUkuran.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(3)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(3) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(3) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  BS
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Budi S.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">3 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Awalnya ragu tapi setelah coba ternyata mantap! Kamera HDnya benar-benar membantu lihat kotoran di dalam telinga. Korek jellynya juga lembut, anak saya jadi suka dibersihin telinganya. Recommended! 👍
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(4)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(4) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(4) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>

              {/* Seller Reply */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border-l-4 border-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-700">THTCARE.ID</span>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">Penjual</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih kak Budi! Senang bisa membantu si kecil nyaman bersihin telinga. Jangan lupa share ke teman-teman ya! 😊
                </p>
              </div>
            </div>

            {/* Review 5 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AW
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Ani W.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">4 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Barang sampai dengan selamat, packing rapi. Sudah dicoba dan hasilnya memuaskan! Kamera jernih banget, kelihatan jelas kotoran di telinga. Korek jellynya juga lengket sempurna. Puas belanja disini! 💯
              </p>

              <div className="flex gap-2 mb-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/2. korekkameraonly.jpg")}>
                  <img src="/2. korekkameraonly.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(5)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(5) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(5) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>
            </div>

            {/* Review 6 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  DP
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Dedi P.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <svg className="w-3 h-3 text-slate-300 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-xs text-slate-400 ml-2">6 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Produk bagus, kamera berfungsi dengan baik. Cuma aplikasinya agak susah dihubungkan pertama kali. Tapi setelah connect, hasilnya mantap! Korek jellynya lengket dan aman dipakai. Overall puas! 👌
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(6)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(6) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(6) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>

              {/* Seller Reply */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border-l-4 border-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-700">THTCARE.ID</span>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">Penjual</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih kak Dedi atas feedbacknya! Kami akan perbaiki panduan koneksi aplikasinya agar lebih mudah. Senang produknya bermanfaat! 🙏
                </p>
              </div>
            </div>

            {/* Review 7 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  MR
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Maya R.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">1 minggu yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Beli untuk suami yang sering keluhan telinga gatal. Setelah pakai ini, telinganya jadi bersih dan gatalnya hilang! Kamera HDnya keren banget, bisa lihat langsung kotorannya. Korek jellynya juga nyaman dipakai. Recommended! ✨
              </p>

              <div className="flex gap-2 mb-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/3.korekjelly.jpg")}>
                  <img src="/3.korekjelly.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/BonusPinUkuran.jpg")}>
                  <img src="/BonusPinUkuran.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(7)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(7) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(7) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>
            </div>

            {/* Review 8 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AS
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Andi S.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">8 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Mantap banget! Akhirnya bisa bersihin telinga sendiri tanpa takut. Kamera HDnya jernih, kelihatan jelas kotorannya. Korek jellynya lengket dan lembut. Bonus kepala penggantinya juga banyak. Worth it! 🔥
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(8)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(8) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(8) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>

              {/* Seller Reply */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border-l-4 border-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-700">THTCARE.ID</span>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">Penjual</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Makasih kak Andi! Senang bisa membantu membersihkan telinga dengan aman dan nyaman. Selamat menggunakan! 🎉
                </p>
              </div>
            </div>

            {/* Review 9 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  RL
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Rina L.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">10 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Beli untuk hadiah ultah suami, dia suka banget! Katanya ini solusi cerdas buat bersihin telinga. Kamera HDnya keren, korek jellynya juga lengket sempurna. Packingnya rapi dan pengiriman cepat. Puas! 🎁
              </p>

              <div className="flex gap-2 mb-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/BonusPinUkuran.jpg")}>
                  <img src="/BonusPinUkuran.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(9)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(9) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(9) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>
            </div>

            {/* Review 10 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  YP
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Yoga P.</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">Pembeli Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1 my-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">12 hari yang lalu</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-sm mb-3 leading-relaxed">
                Produk sesuai deskripsi, kamera HD berfungsi dengan baik di HP Android saya. Korek jellynya lengket dan aman, tidak sakit sama sekali. Sudah coba untuk anak dan istri, hasilnya memuaskan. Recommended seller! 👏
              </p>

              <div className="flex gap-2 mb-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/2. korekkameraonly.jpg")}>
                  <img src="/2. korekkameraonly.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80" onClick={() => setSelectedImage("/3.korekjelly.jpg")}>
                  <img src="/3.korekjelly.jpg" alt="Review" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHelpful(10)}
                  className={`flex items-center gap-1.5 text-xs ${helpfulReviews.includes(10) ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-800`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulReviews.includes(10) ? 'fill-current' : ''}`} />
                  Membantu
                </button>
                <span className="text-xs text-slate-400">Varian: Paket Bundle Lengkap</span>
              </div>

              {/* Seller Reply */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border-l-4 border-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-700">THTCARE.ID</span>
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">Penjual</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih banyak kak Yoga! Senang bisa membantu keluarga Anda membersihkan telinga dengan aman. Jangan lupa kasih tau teman-teman ya! 🙏✨
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4 flex justify-center items-center gap-2">
            <Truck className="w-6 h-6 text-slate-500" /> Lacak Pesanan Anda
          </h3>
          <form onSubmit={handleTrackOrder} className="relative shadow-sm rounded-xl">
            <input
              type="text"
              placeholder="Masukkan Nomor HP / Resi / Order ID"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-600 transition">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-2">Cek status pengiriman pesanan Anda secara real-time.</p>
        </div>
      </section>

      <footer className="bg-slate-800 text-slate-300 py-8 text-center text-sm border-t-4 border-slate-500">
        <p>© 2026 THTCARE.ID. All rights reserved.</p>
        <button onClick={() => navigateTo('/admin')} className="mt-4 text-slate-400/50 hover:text-slate-300 text-xs uppercase tracking-widest transition">
          Admin Login
        </button>
      </footer>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-rose-400 z-50 p-2 bg-black/50 rounded-full transition"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Zoom Preview"
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300 border-4 border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
