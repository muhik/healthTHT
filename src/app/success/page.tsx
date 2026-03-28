'use client';

import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, Copy, MessageCircle, ArrowLeft, RefreshCw, AlertTriangle, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackPixel } from '@/lib/data';

export default function SuccessPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<any>({
        name: 'Pelanggan',
        phone: '-',
        email: '-',
        amount: 149000
    });
    const [copied, setCopied] = useState<string | null>(null);
    const [isPaid, setIsPaid] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Retrieve last order from localStorage
        if (typeof window !== 'undefined') {
            const lastOrderStr = localStorage.getItem('lastOrder');
            if (lastOrderStr) {
                const lastOrder = JSON.parse(lastOrderStr);
                setFormData(lastOrder);

                // Check if already paid
                if (lastOrder.status === 'PAID') {
                    setIsPaid(true);
                    setIsChecking(false);
                    trackPixel('Purchase', { value: lastOrder.amount || 149000, currency: 'IDR' });
                } else {
                    // Start polling for status
                    startStatusPolling(lastOrder.id);
                }
            } else {
                setIsChecking(false);
            }
        }
    }, []);

    const startStatusPolling = (orderId: string) => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/transactions?id=${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'PAID') {
                        setIsPaid(true);
                        setIsChecking(false);
                        trackPixel('Purchase', { value: data.amount || 149000, currency: 'IDR' });

                        // Update localStorage
                        const lastOrderStr = localStorage.getItem('lastOrder');
                        if (lastOrderStr) {
                            const lastOrder = JSON.parse(lastOrderStr);
                            lastOrder.status = 'PAID';
                            localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
                        }
                        return;
                    }
                }
                // Continue polling every 5 seconds
                setTimeout(() => checkStatus(), 5000);
            } catch (error) {
                console.error('Error checking status:', error);
                setTimeout(() => checkStatus(), 5000);
            }
        };

        // Start first check after 3 seconds
        setTimeout(() => checkStatus(), 3000);
    };

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    // Format nomor WhatsApp untuk link WA
    const formatWA = (phone: string) => {
        return phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    };

    const orderId = formData.id || `TRX-${Math.floor(Math.random() * 10000)}`;

    // TAMPILAN HALAMAN SUKSES (SETELAH PAID)
    if (isPaid) {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border border-emerald-100">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Pembayaran Berhasil!</h2>
                    <p className="text-slate-600 mb-6">
                        Terima kasih, <strong>{formData.name}</strong>. Pesanan Anda sedang kami proses.<br />
                        ID Pesanan: <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded">{orderId}</span>
                        <br /><br />
                        Resi akan dikirim ke WhatsApp: <strong>{formData.phone}</strong> dalam 1x24 jam.
                    </p>

                    {/* Split Shipment Notice */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left mb-8 flex gap-3">
                        <AlertTriangle className="w-10 h-10 text-amber-500 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-800 text-sm mb-1">PENTING: Info Pengiriman</h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Karena cairan butuh penanganan khusus, beberapa paket mungkin dikirim <strong>TERPISAH (2 Resi)</strong> dari gudang berbeda.
                                <br /><br />
                                Jangan panik jika baru sampai satu bagian ya! Bagian lainnya sedang dalam perjalanan.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => router.push(`/track?id=${orderId}`)}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                        >
                            <Truck className="w-5 h-5" /> Lacak Pesanan Saya
                        </button>
                        <button onClick={() => router.push('/')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // TAMPILAN HALAMAN MENUNGGU PEMBAYARAN
    return (
        <div className="min-h-screen bg-stone-50 py-6 px-4 font-sans">
            <div className="max-w-md mx-auto">
                {/* Header - Orange Gradient */}
                <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-3xl p-6 text-center text-white mb-4 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Menunggu Pembayaran</h1>
                    <p className="text-white/90 text-sm">Pesanan #{orderId.split('-')[1] || '001'} sedang diproses</p>
                </div>

                {/* Detail Pesanan */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 mb-4">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Detail Pesanan</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Nama</span>
                            <span className="font-medium text-slate-800 text-sm">{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Email</span>
                            <span className="font-medium text-slate-800 text-sm">{formData.email || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">WhatsApp</span>
                            <span className="font-medium text-slate-800 text-sm">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                            <span className="text-slate-500 text-sm">Total Bayar</span>
                            <span className="font-bold text-emerald-600 text-lg">
                                Rp {formData.amount?.toLocaleString('id-ID') || '149.000'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cara Pembayaran */}
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="text-amber-500">💳</span> Cara Pembayaran
                    </h3>

                    {/* Transfer Bank BCA */}
                    <div className="bg-blue-50 rounded-2xl p-4 mb-3 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                BCA
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Transfer Bank BCA</p>
                                <p className="text-xs text-slate-500">a.n. Muhamad Ikbal</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                            <span className="font-mono font-bold text-blue-700 text-lg tracking-wider">
                                5015 17 1330
                            </span>
                            <button
                                onClick={() => handleCopy('5015171330', 'bca')}
                                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 transition"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                {copied === 'bca' ? 'Tersalin!' : 'Salin'}
                            </button>
                        </div>
                    </div>

                    {/* DANA */}
                    <div className="bg-purple-50 rounded-2xl p-4 mb-3 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#0084FF] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                DANA
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">DANA</p>
                                <p className="text-xs text-slate-500">Scan QR atau kirim ke nomor</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                            <span className="font-mono font-bold text-[#0084FF] text-lg tracking-wider">
                                089 6666 39 360
                            </span>
                            <button
                                onClick={() => handleCopy('089666639360', 'dana')}
                                className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-700 transition"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                {copied === 'dana' ? 'Tersalin!' : 'Salin'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Langkah Selanjutnya */}
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 mb-4">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                        <span className="text-amber-600">⏱</span> Langkah Selanjutnya
                    </h4>
                    <ol className="space-y-2 text-sm text-amber-900">
                        <li className="flex gap-2">
                            <span className="font-bold">1.</span>
                            <span>Transfer sesuai nominal <strong>Rp {formData.amount?.toLocaleString('id-ID') || '149.000'}</strong></span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">2.</span>
                            <span>Gunakan salah satu metode pembayaran di atas</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">3.</span>
                            <span>Screenshot bukti pembayaran (opsional)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">4.</span>
                            <span>Tunggu admin menandai pembayaran lunas</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">5.</span>
                            <span>Halaman ini akan otomatis redirect ke halaman sukses</span>
                        </li>
                    </ol>
                </div>

                {/* Status Pengecekan */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-4">
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
                        <RefreshCw className={`w-4 h-4 text-emerald-500 ${isChecking ? 'animate-spin' : ''}`} />
                        <span>{isChecking ? 'Mengecek status pembayaran secara otomatis...' : 'Menunggu pembayaran'}</span>
                    </div>
                </div>

                {/* Bantuan */}
                <div className="text-center mb-4">
                    <p className="text-slate-500 text-sm mb-3">Butuh bantuan? Hubungi admin</p>
                    <a
                        href={`https://wa.me/${formatWA(formData.phone || '089666639360')}?text=Halo%20admin%2C%20saya%20sudah%20melakukan%20pembayaran%20untuk%20pesanan%20${orderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Konfirmasi via WhatsApp
                    </a>
                </div>

                {/* Kembali */}
                <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 py-3 text-sm font-medium transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Halaman Utama
                </button>
            </div>
        </div>
    );
}
