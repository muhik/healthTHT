'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackPixel, initialTransactions } from '@/lib/data';

// Tarif JNE untuk Paket Bundle LPTHT (estimasi berat ~1.5kg)
// Tarif REG (Regular) JNE 2025
const shippingRates: Record<string, number> = {
    // Jabodetabek - Gratis Ongkir
    'Jakarta': 0,
    'Bogor': 0,
    'Depok': 0,
    'Tangerang': 0,
    'Bekasi': 0,

    // Jawa Barat
    'Bandung': 15000,
    'Bandung Barat': 15000,
    'Cimahi': 15000,
    'Garut': 18000,
    'Tasikmalaya': 20000,
    'Cirebon': 18000,
    'Indramayu': 20000,
    'Karawang': 15000,
    'Purwakarta': 15000,
    'Sukabumi': 18000,
    'Cianjur': 15000,
    'Kuningan': 20000,
    'Majalengka': 20000,
    'Subang': 18000,
    'Sumedang': 18000,
    'Pangandaran': 25000,
    'Banjar': 22000,

    // Jawa Tengah
    'Semarang': 22000,
    'Solo': 24000,
    'Yogyakarta': 25000,
    'Magelang': 25000,
    'Pekalongan': 22000,
    'Tegal': 22000,
    'Purwokerto': 24000,
    'Salatiga': 22000,
    'Kendal': 22000,
    'Demak': 22000,
    'Kudus': 24000,
    'Jepara': 24000,
    'Pati': 24000,
    'Rembang': 24000,
    'Blora': 24000,
    'Grobogan': 24000,
    'Sragen': 24000,
    'Klaten': 25000,
    'Boyolali': 24000,
    'Sukoharjo': 24000,
    'Karanganyar': 24000,
    'Wonogiri': 25000,
    'Purworejo': 26000,
    'Temanggung': 26000,
    'Wonosobo': 26000,
    'Banjarnegara': 26000,
    'Kebumen': 26000,
    'Gombong': 26000,
    'Banyumas': 26000,
    'Cilacap': 26000,
    'Purbalingga': 26000,
    'Brebes': 22000,
    'Pemalang': 22000,
    'Batang': 22000,

    // Jawa Timur
    'Surabaya': 28000,
    'Malang': 30000,
    'Sidoarjo': 28000,
    'Gresik': 28000,
    'Mojokerto': 28000,
    'Jombang': 28000,
    'Kediri': 30000,
    'Blitar': 32000,
    'Tulungagung': 32000,
    'Trenggalek': 32000,
    'Pacitan': 35000,
    'Ponorogo': 32000,
    'Magetan': 30000,
    'Ngawi': 30000,
    'Madiun': 30000,
    'Nganjuk': 30000,
    'Lamongan': 28000,
    'Tuban': 28000,
    'Bojonegoro': 30000,
    'Lumajang': 35000,
    'Jember': 35000,
    'Banyuwangi': 38000,
    'Bondowoso': 38000,
    'Situbondo': 38000,
    'Probolinggo': 32000,
    'Pasuruan': 30000,
    'Bangkalan': 30000,
    'Sampang': 32000,
    'Pamekasan': 32000,
    'Sumenep': 35000,
    'Batu': 30000,

    // Banten
    'Serang': 12000,
    'Cilegon': 12000,
    'Lebak': 18000,
    'Pandeglang': 18000,
    'Rangkasbitung': 15000,

    // Sumatera
    'Medan': 45000,
    'Palembang': 45000,
    'Lampung': 40000,
    'Pekanbaru': 48000,
    'Padang': 52000,
    'Banda Aceh': 55000,
    'Jambi': 48000,
    'Bengkulu': 52000,
    'Pangkal Pinang': 50000,
    'Tanjung Pinang': 52000,
    'Batam': 52000,
    'Bandar Lampung': 40000,
    'Metro': 42000,
    'Prabumulih': 45000,
    'Lubuklinggau': 48000,
    'Pagar Alam': 48000,
    'Binjai': 45000,
    'Padang Sidempuan': 48000,
    'Pematangsiantar': 48000,
    'Tebing Tinggi': 48000,
    'Tanjungbalai': 48000,
    'Sibolga': 52000,
    'Gunungsitoli': 55000,
    'Padangpanjang': 52000,
    'Bukittinggi': 52000,
    'Payakumbuh': 52000,
    'Solok': 52000,
    'Sawah Lunto': 52000,
    'Pariaman': 52000,
    'Padang Pariaman': 52000,
    'Agam': 52000,
    'Dumai': 48000,
    'Tanjung Balai Karimun': 52000,
    'Tanjung Batu': 52000,

    // Kalimantan
    'Pontianak': 55000,
    'Samarinda': 58000,
    'Balikpapan': 58000,
    'Banjarmasin': 58000,
    'Palangkaraya': 60000,
    'Singkawang': 58000,
    'Ketapang': 60000,
    'Sintang': 60000,
    'Kapuas Hulu': 62000,
    'Sanggau': 60000,
    'Landak': 58000,
    'Bengkayang': 60000,
    'Kubu Raya': 55000,
    'Mempawah': 55000,
    'Melawi': 62000,
    'Sekadau': 62000,
    'Bontang': 60000,
    'Kutai Kartanegara': 58000,
    'Kutai Timur': 62000,
    'Kutai Barat': 62000,
    'Berau': 65000,
    'Paser': 62000,
    'Penajam Paser Utara': 60000,
    'Mahakam Ulu': 65000,
    'Barito Utara': 62000,
    'Barito Selatan': 62000,
    'Barito Timur': 65000,
    'Barito Kuala': 60000,
    'Gunung Mas': 65000,
    'Kapuas': 62000,
    'Katingan': 65000,
    'Kotawaringin Timur': 62000,
    'Kotawaringin Barat': 62000,
    'Lamandau': 65000,
    'Murung Raya': 68000,
    'Pulang Pisau': 62000,
    'Seruyan': 65000,
    'Sukamara': 65000,
    'Tanah Bumbu': 60000,
    'Tanah Laut': 58000,
    'Tapin': 60000,
    'Hulu Sungai Utara': 62000,
    'Hulu Sungai Tengah': 62000,
    'Hulu Sungai Selatan': 62000,
    'Tabalong': 62000,
    'Balangan': 62000,
    'Barito': 60000,
    'Kotabaru': 62000,
    'Banjarbaru': 58000,

    // Sulawesi
    'Makassar': 60000,
    'Manado': 65000,
    'Palu': 65000,
    'Kendari': 68000,
    'Gorontalo': 68000,
    'Mamuju': 70000,
    'Parepare': 62000,
    'Palopo': 65000,
    'Baubau': 68000,
    'Bitung': 68000,
    'Tomohon': 68000,
    'Kotamobagu': 70000,
    'Ternate': 72000,
    'Tidore': 72000,
    'Wakatobi': 75000,
    'Buton': 72000,
    'Muna': 72000,
    'Konawe': 70000,
    'Konawe Selatan': 72000,
    'Konawe Utara': 72000,
    'Konawe Kepulauan': 75000,
    'Bombana': 75000,
    'Kolaka': 70000,
    'Kolaka Utara': 72000,
    'Kolaka Timur': 72000,
    'North Luwu': 68000,
    'Luwu': 68000,
    'Luwu Timur': 72000,
    'Luwu Utara': 72000,
    'Toraja Utara': 72000,
    'Tana Toraja': 72000,
    'Sidenreng Rappang': 68000,
    'Pinrang': 68000,
    'Enrekang': 70000,
    'Sinjai': 68000,
    'Gowa': 65000,
    'Takalar': 65000,
    'Jeneponto': 68000,
    'Bantaeng': 68000,
    'Bulukumba': 68000,
    'Selayar': 75000,
    'Maros': 62000,
    'Pangkajene': 68000,
    'Barru': 65000,
    'Soppeng': 68000,
    'Wajo': 68000,
    'Bone': 68000,

    // Bali & Nusa Tenggara
    'Denpasar': 35000,
    'Badung': 35000,
    'Gianyar': 35000,
    'Tabanan': 38000,
    'Klungkung': 38000,
    'Karangasem': 40000,
    'Bangli': 38000,
    'Jembrana': 40000,
    'Buleleng': 42000,
    'Mataram': 40000,
    'Lombok Barat': 42000,
    'Lombok Timur': 42000,
    'Lombok Utara': 45000,
    'Lombok Tengah': 42000,
    'Sumbawa': 48000,
    'Sumbawa Barat': 50000,
    'Dompu': 48000,
    'Bima': 48000,
    'Kupang': 52000,
    'Ende': 55000,
    'Flores': 55000,
    'Sikka': 55000,
    'Ngada': 58000,
    'Manggarai': 58000,
    'Manggarai Barat': 60000,
    'Manggarai Timur': 60000,
    'Nagekeo': 58000,
    'Sumba Barat': 62000,
    'Sumba Timur': 62000,
    'Sumba Tengah': 65000,
    'Sumba Barat Daya': 65000,
    'Sabu Raijua': 68000,
    'Rote Ndao': 65000,
    'Alor': 68000,
    'Lembata': 68000,
    'Belu': 65000,
    'Malaka': 65000,
    'Timor Tengah Selatan': 62000,
    'Timor Tengah Utara': 62000,

    // Papua & Maluku
    'Jayapura': 85000,
    'Sorong': 90000,
    'Manokwari': 88000,
    'Biak': 92000,
    'Merauke': 95000,
    'Timika': 90000,
    'Nabire': 92000,
    'Serui': 95000,
    'Wamena': 98000,
    'Fakfak': 95000,
    'Kaimana': 95000,
    'Teluk Bintuni': 98000,
    'Teluk Wondama': 98000,
    'Raja Ampat': 100000,
    'Misool': 100000,
    'Salawati': 98000,
    'Waigeo': 100000,
    'Ambon': 75000,
    'Tual': 78000,
    'Masohi': 78000,
    'Langgur': 78000,
    'Banda Neira': 80000,
    'Namlea': 80000,
    'Dobo': 82000,
    'Saumlaki': 82000,
    'Buru': 80000,
    'Buru Selatan': 82000,
    'Seram': 80000,
    'Seram Bagian Barat': 82000,
    'Seram Bagian Timur': 82000,
    'Kepulauan Aru': 85000,
    'Kepulauan Tanimbar': 85000,
    'Maluku Barat Daya': 85000,
    'Maluku Tengah': 78000,
    'Maluku Tenggara': 80000,
    'Maluku Tenggara Barat': 82000,
    'Maluku Utara': 82000,
    'Halmahera': 85000,
    'Pulau Obi': 88000,
    'Pulau Bacan': 88000,
    'Pulau Jailolo': 88000,
    'Pulau Weda': 90000,
    'Pulau Gebe': 90000,

    // Default untuk kota lain
    'Lainnya': 30000
};

// Grouping kota untuk dropdown
const cityGroups = {
    'Jabodetabek (Gratis Ongkir)': [
        'Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Tangerang Selatan'
    ],
    'Jawa Barat': [
        'Bandung', 'Bandung Barat', 'Cimahi', 'Garut', 'Tasikmalaya', 'Cirebon',
        'Indramayu', 'Karawang', 'Purwakarta', 'Sukabumi', 'Cianjur', 'Kuningan',
        'Majalengka', 'Subang', 'Sumedang', 'Pangandaran', 'Banjar'
    ],
    'Jawa Tengah': [
        'Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Pekalongan', 'Tegal',
        'Purwokerto', 'Salatiga', 'Kendal', 'Demak', 'Kudus', 'Jepara', 'Pati',
        'Rembang', 'Blora', 'Grobogan', 'Sragen', 'Klaten', 'Boyolali', 'Sukoharjo',
        'Karanganyar', 'Wonogiri', 'Purworejo', 'Temanggung', 'Wonosobo', 'Banjarnegara',
        'Kebumen', 'Gombong', 'Banyumas', 'Cilacap', 'Purbalingga', 'Brebes', 'Pemalang', 'Batang'
    ],
    'Jawa Timur': [
        'Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Mojokerto', 'Jombang', 'Kediri',
        'Blitar', 'Tulungagung', 'Trenggalek', 'Pacitan', 'Ponorogo', 'Magetan', 'Ngawi',
        'Madiun', 'Nganjuk', 'Lamongan', 'Tuban', 'Bojonegoro', 'Lumajang', 'Jember',
        'Banyuwangi', 'Bondowoso', 'Situbondo', 'Probolinggo', 'Pasuruan', 'Bangkalan',
        'Sampang', 'Pamekasan', 'Sumenep', 'Batu'
    ],
    'Banten': [
        'Serang', 'Cilegon', 'Lebak', 'Pandeglang', 'Rangkasbitung'
    ],
    'Sumatera': [
        'Medan', 'Palembang', 'Lampung', 'Pekanbaru', 'Padang', 'Banda Aceh', 'Jambi',
        'Bengkulu', 'Pangkal Pinang', 'Tanjung Pinang', 'Batam', 'Bandar Lampung', 'Metro',
        'Prabumulih', 'Lubuklinggau', 'Pagar Alam', 'Binjai', 'Padang Sidempuan',
        'Pematangsiantar', 'Tebing Tinggi', 'Tanjungbalai', 'Sibolga', 'Gunungsitoli',
        'Padangpanjang', 'Bukittinggi', 'Payakumbuh', 'Solok', 'Sawah Lunto', 'Pariaman',
        'Padang Pariaman', 'Agam', 'Dumai', 'Tanjung Balai Karimun', 'Tanjung Batu'
    ],
    'Kalimantan': [
        'Pontianak', 'Samarinda', 'Balikpapan', 'Banjarmasin', 'Palangkaraya', 'Singkawang',
        'Ketapang', 'Sintang', 'Kapuas Hulu', 'Sanggau', 'Landak', 'Bengkayang', 'Kubu Raya',
        'Mempawah', 'Melawi', 'Sekadau', 'Bontang', 'Kutai Kartanegara', 'Kutai Timur',
        'Kutai Barat', 'Berau', 'Paser', 'Penajam Paser Utara', 'Mahakam Ulu', 'Barito Utara',
        'Barito Selatan', 'Barito Timur', 'Barito Kuala', 'Gunung Mas', 'Kapuas', 'Katingan',
        'Kotawaringin Timur', 'Kotawaringin Barat', 'Lamandau', 'Murung Raya', 'Pulang Pisau',
        'Seruyan', 'Sukamara', 'Tanah Bumbu', 'Tanah Laut', 'Tapin', 'Hulu Sungai Utara',
        'Hulu Sungai Tengah', 'Hulu Sungai Selatan', 'Tabalong', 'Balangan', 'Barito',
        'Kotabaru', 'Banjarbaru'
    ],
    'Sulawesi': [
        'Makassar', 'Manado', 'Palu', 'Kendari', 'Gorontalo', 'Mamuju', 'Parepare', 'Palopo',
        'Baubau', 'Bitung', 'Tomohon', 'Kotamobagu', 'Wakatobi',
        'Buton', 'Muna', 'Konawe', 'Konawe Selatan', 'Konawe Utara', 'Konawe Kepulauan',
        'Bombana', 'Kolaka', 'Kolaka Utara', 'Kolaka Timur', 'North Luwu', 'Luwu', 'Luwu Timur',
        'Luwu Utara', 'Toraja Utara', 'Tana Toraja', 'Sidenreng Rappang', 'Pinrang', 'Enrekang',
        'Sinjai', 'Gowa', 'Takalar', 'Jeneponto', 'Bantaeng', 'Bulukumba', 'Selayar', 'Maros',
        'Pangkajene', 'Barru', 'Soppeng', 'Wajo', 'Bone'
    ],
    'Bali & Nusa Tenggara': [
        'Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Klungkung', 'Karangasem', 'Bangli',
        'Jembrana', 'Buleleng', 'Mataram', 'Lombok Barat', 'Lombok Timur', 'Lombok Utara',
        'Lombok Tengah', 'Sumbawa', 'Sumbawa Barat', 'Dompu', 'Bima', 'Kupang', 'Ende',
        'Flores', 'Sikka', 'Ngada', 'Manggarai', 'Manggarai Barat', 'Manggarai Timur',
        'Nagekeo', 'Sumba Barat', 'Sumba Timur', 'Sumba Tengah', 'Sumba Barat Daya',
        'Sabu Raijua', 'Rote Ndao', 'Alor', 'Lembata', 'Belu', 'Malaka', 'Timor Tengah Selatan',
        'Timor Tengah Utara'
    ],
    'Papua & Maluku': [
        'Jayapura', 'Sorong', 'Manokwari', 'Biak', 'Merauke', 'Timika', 'Nabire', 'Serui',
        'Wamena', 'Fakfak', 'Kaimana', 'Teluk Bintuni', 'Teluk Wondama', 'Raja Ampat',
        'Misool', 'Salawati', 'Waigeo', 'Ambon', 'Tual', 'Masohi', 'Langgur', 'Banda Neira',
        'Namlea', 'Dobo', 'Saumlaki', 'Buru', 'Buru Selatan', 'Seram', 'Seram Bagian Barat',
        'Seram Bagian Timur', 'Kepulauan Aru', 'Kepulauan Tanimbar', 'Maluku Barat Daya',
        'Maluku Tengah', 'Maluku Tenggara', 'Maluku Tenggara Barat', 'Maluku Utara',
        'Halmahera', 'Moro', 'Pulau Obi', 'Pulau Bacan', 'Pulau Jailolo', 'Pulau Weda',
        'Pulau Gebe'
    ],
    'Lainnya': ['Lainnya']
};

export default function CheckoutPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: 'Jakarta', // Default Jabodetabek
        note: ''
    });

    const shippingCost = shippingRates[formData.city] ?? 30000;
    const isFreeShipping = shippingCost === 0;
    const totalAmount = 150000 + shippingCost;

    useEffect(() => {
        // Track saat user masuk halaman checkout
        trackPixel('InitiateCheckout');
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const newTrx = {
            id: `TRX-${Math.floor(Math.random() * 10000)}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location: formData.city,
            status: 'PENDING', // Status awal Pending (menunggu pembayaran)
            amount: totalAmount,
            date: new Date().toISOString().split('T')[0],
            address: formData.address,
            note: formData.note,
            // Simulasi Link Pembayaran Mayar (Nanti diganti API Call Beneran)
            payment_url: `https://mayar.id/pay/dummy-link?amount=${totalAmount}&ref=${Math.floor(Math.random() * 10000)}`
        };

        try {
            // 1. Post to SQLite Backend
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTrx),
            });

            if (!response.ok) {
                throw new Error('Failed to save transaction');
            }

            // 2. Track Pixel AddPaymentInfo
            trackPixel('AddPaymentInfo');

            // 3. Save ephemeral data for success page (can still use LS for this client-side transition)
            if (typeof window !== 'undefined') {
                localStorage.setItem('lastOrder', JSON.stringify(newTrx));
            }

            // 4. Integrasi Mayar (Simulasi)
            console.log("Membuat Link Pembayaran Mayar untuk:", totalAmount);

            // Simulasi sukses bayar
            setTimeout(() => {
                router.push('/success');
            }, 1500);

        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
        }
    };

    const handleImageError = (e: any) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/400x500/1a1a1a/FFF?text=ASPAL+CAIR+1KG";
    };

    return (
        <div className="bg-stone-50 min-h-screen py-8 px-4 font-sans text-slate-900">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => router.push('/')} className="flex items-center text-slate-500 hover:text-amber-600 mb-6 font-medium">
                    <ArrowRight className="w-4 h-4 rotate-180 mr-2" /> Kembali ke Produk
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-amber-500" /> Rincian Pesanan
                        </h2>
                        <span className="text-sm opacity-70">Langkah 2 dari 2</span>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Order Summary */}
                        <div className="flex gap-4 mb-8 bg-stone-50 p-4 rounded-xl border border-stone-200">
                            <div className="w-20 h-20 bg-stone-200 rounded-lg flex-shrink-0 overflow-hidden border border-stone-300">
                                {/* Gambar Kamera Endoskop sebagai thumbnail */}
                                <img
                                    src="/2.%20korekkameraonly.jpg"
                                    onError={handleImageError}
                                    alt="Pembersih Telinga Pintar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">Pembersih Telinga Pintar (Bundle)</h4>
                                <p className="text-sm text-slate-500">Kamera WiFi HD + Korek Jelly + Bonus 5 Kepala</p>
                                <p className="text-amber-600 font-bold mt-1">Rp 150.000</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handlePayment} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                <input required name="name" onChange={handleChange} value={formData.name} type="text" className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" placeholder="Contoh: Budi Santoso" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input required name="email" onChange={handleChange} value={formData.email} type="email" className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" placeholder="email@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nomor WhatsApp (Aktif)</label>
                                <input required name="phone" onChange={handleChange} value={formData.phone} type="tel" className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" placeholder="0812..." />
                                <p className="text-xs text-slate-400 mt-1">*Resi otomatis dikirim ke WA ini.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kota / Kabupaten</label>
                                    <select name="city" onChange={handleChange} value={formData.city} className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                                        {Object.entries(cityGroups).map(([group, cities]) => (
                                            <optgroup key={group} label={group}>
                                                {cities.map(city => (
                                                    <option key={city} value={city}>
                                                        {city} {shippingRates[city] === 0 ? '(Gratis Ongkir)' : `- Rp ${shippingRates[city]?.toLocaleString() || '30.000'}`}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    {isFreeShipping ? (
                                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl w-full border border-emerald-100">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="font-bold text-sm">Gratis Ongkir Aktif!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-slate-600 bg-slate-100 px-4 py-3 rounded-xl w-full border border-slate-200">
                                            <Truck className="w-5 h-5 mr-2" />
                                            <span className="font-bold text-sm">+ Ongkir Rp {shippingCost.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap</label>
                                <textarea required name="address" onChange={handleChange} value={formData.address} className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition h-24" placeholder="Jalan, Nomor Rumah, RT/RW, Kecamatan..."></textarea>
                            </div>

                            {/* Payment Summary */}
                            <div className="border-t-2 border-dashed border-stone-200 pt-6 mt-6">
                                <div className="flex justify-between mb-2 text-slate-600">
                                    <span>Subtotal Produk</span>
                                    <span>Rp 150.000</span>
                                </div>
                                <div className="flex justify-between mb-4 text-slate-600">
                                    <span>Ongkos Kirim</span>
                                    <span>{shippingCost === 0 ? <span className="text-emerald-600 font-bold">GRATIS (Rp 0)</span> : `Rp ${shippingCost.toLocaleString()}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-slate-900 mb-6">
                                    <span>Total Bayar</span>
                                    <span>Rp {totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-5 rounded-xl text-xl shadow-lg transition transform active:scale-95">
                                BAYAR SEKARANG
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-4">🔒 Pembayaran Aman & Mudah: QRIS, Transfer Bank, E-Wallet</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
