'use client';

import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, ChevronRight, ArrowLeft, MessageCircle, MapPin, AlertCircle, ShoppingBag, LayoutGrid, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

function TrackPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null); // { orders: [] }
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        const queryId = searchParams.get('id');
        if (queryId) {
            setSearch(queryId);
            performSearch(queryId);
        }
    }, [searchParams]);

    // Real-time Polling: Refresh data every 5 seconds if there is a result
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (result && search) {
            interval = setInterval(() => {
                performSearch(search, true); // Silent refresh
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [result, search]);

    const performSearch = async (query: string, isBackground = false) => {
        if (!isBackground) {
            setLoading(true);
            setError('');
            setResult(null);
        }

        try {
            const res = await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search: query }),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data);
            } else {
                if (!isBackground) setError(data.error);
            }
        } catch (err) {
            if (!isBackground) setError('Terjadi kesalahan koneksi.');
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(search);
    };

    // Filter orders based on active tab
    const filteredOrders = result?.orders?.filter((order: any) => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'LEAD') return order.status === 'LEAD';
        if (activeTab === 'PROCESSED') return order.status === 'PAID' || order.status === 'PROCESSED';
        if (activeTab === 'SHIPPED') return order.status === 'SHIPPED';
        if (activeTab === 'DONE') return order.status === 'DONE';
        return true;
    }) || [];

    const tabs = [
        { id: 'ALL', label: 'Semua', icon: LayoutGrid },
        { id: 'LEAD', label: 'Belum Bayar', icon: Clock },
        { id: 'PROCESSED', label: 'Dikemas', icon: Package },
        { id: 'SHIPPED', label: 'Dikirim', icon: Truck },
        { id: 'DONE', label: 'Selesai', icon: CheckCircle },
    ];

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
            {/* Header (Shopee style orange/red gradient or brand color) */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-50 flex items-center gap-4">
                <button onClick={() => router.push('/')} className="text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 bg-slate-100 rounded-lg flex items-center px-4 py-2">
                    <Search className="w-5 h-5 text-slate-400 mr-2" />
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none text-sm font-semibold text-slate-700 placeholder-slate-400"
                            placeholder="Cari berdasarkan No HP atau Order ID"
                        />
                    </form>
                </div>
                <button onClick={() => router.push('/')} className="relative">
                    <ShoppingBag className="w-6 h-6 text-slate-600" />
                </button>
            </div>

            {/* Content */}
            {!result ? (
                <div className="p-8 text-center mt-10">
                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Lacak Pesanan Kamu</h2>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Masukan Nomor HP yang kamu gunakan saat checkout atau Order ID untuk melihat status pesanan.</p>
                </div>
            ) : (
                <>
                    {/* Iconic Tabs (Aesthetic Flow) */}
                    <div className="bg-white shadow-sm mb-4">
                        <div className="flex justify-between items-center px-4 py-4 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300 relative ${isActive ? 'text-amber-500 scale-110' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-amber-100 shadow-amber-200 shadow-md' : 'bg-slate-50'}`}>
                                            <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                        </div>
                                        <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                                            {tab.label}
                                        </span>
                                        {isActive && (
                                            <span className="absolute -bottom-4 w-12 h-1 bg-amber-500 rounded-t-full"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order List */}
                    <div className="max-w-xl mx-auto pb-20">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-20">
                                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">Belum ada pesanan di tab ini.</p>
                            </div>
                        ) : (
                            filteredOrders.map((order: any) => (
                                <div key={order.id} className="bg-white mb-3 p-4 shadow-sm border-t border-b border-slate-100 md:rounded-lg md:border">
                                    {/* Header Item */}
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Star+</span>
                                            <span className="font-bold text-sm text-slate-800">Proseal Official Store</span>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-bold text-amber-600 uppercase">
                                            {order.status === 'LEAD' ? 'Belum Bayar' :
                                                order.status === 'PAID' ? 'Sedang Dikemas' :
                                                    order.status === 'PROCESSED' ? 'Sedang Dikemas' :
                                                        order.status === 'SHIPPED' ? 'Dikirim' :
                                                            order.status === 'DONE' ? 'Selesai' : order.status}
                                        </span>
                                    </div>

                                    {/* Product Item */}
                                    <div className="flex gap-3 mb-4 cursor-pointer" onClick={() => router.push('/')}>
                                        <div className="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 border border-slate-200 grid grid-cols-2 grid-rows-2 gap-[1px]">
                                            <img src="/Aspal.Jpeg" alt="Aspal" className="row-span-2 h-full w-full object-cover" />
                                            <img src="/NanoSpray.jpg" alt="Spray" className="h-full w-full object-cover" />
                                            <img src="/bonuskuas+sarungtangan.Jpeg" alt="Bonus" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">
                                                Paket Anti Bocor (Aspal Cair 1kg + Nano Spray Waterproof) - Solusi Dak Bocor
                                            </h4>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">x1 Paket Bundling (Lengkap)</p>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-xs text-slate-400 line-through">Rp 249.000</span>
                                                    <span className="text-sm font-bold text-slate-800">{formatRupiah(order.amount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Item */}
                                    <div className="border-t border-slate-50 pt-3 flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-slate-500">{order.items ? order.items.length : 1} Produk</p>
                                            <div className="text-sm">
                                                <span className="text-slate-500 mr-2">Total Pesanan:</span>
                                                <span className="font-bold text-amber-600 text-base">{formatRupiah(order.amount)}</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Buttons based on Status */}
                                        <div className="flex justify-end gap-2 mt-2">
                                            {order.status === 'LEAD' && (
                                                <>
                                                    {order.payment_url && (
                                                        <a href={order.payment_url} target="_blank" className="px-6 py-2 bg-amber-500 text-white rounded text-sm font-bold hover:bg-amber-600 shadow-sm flex items-center gap-2">
                                                            <Wallet className="w-4 h-4" /> Bayar
                                                        </a>
                                                    )}
                                                    {/* Simulation Button */}
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Simulasi: Apakah Anda yakin ingin menandai pesanan ini sebagai SUDAH DIBAYAR?')) {
                                                                await fetch('/api/transactions', {
                                                                    method: 'PUT',
                                                                    body: JSON.stringify({ id: order.id, status: 'PAID' })
                                                                });
                                                                performSearch(search); // Refresh data
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded text-xs font-bold hover:bg-green-200 flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="w-3 h-3" /> Simulasi Sukses Bayar
                                                    </button>
                                                </>
                                            )}

                                            {(order.status === 'PAID' || order.status === 'PROCESSED') && (
                                                <button className="px-6 py-2 bg-slate-200 text-slate-500 rounded text-sm font-bold cursor-not-allowed">
                                                    Menunggu Pengiriman
                                                </button>
                                            )}

                                            {order.status === 'SHIPPED' && (
                                                <>
                                                    <button
                                                        onClick={() => { navigator.clipboard.writeText(order.resi); alert('Resi disalin: ' + order.resi); }}
                                                        className="px-4 py-2 bg-white border border-slate-300 rounded text-sm font-medium text-slate-600"
                                                    >
                                                        Salin Resi: {order.resi}
                                                    </button>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <a
                                                            href={`https://cekresi.com/?noresi=${order.resi}`}
                                                            target="_blank"
                                                            className="flex-1 bg-amber-500 text-white rounded text-sm font-bold hover:bg-amber-600 shadow-sm text-center px-4 py-2 flex items-center justify-center gap-2"
                                                        >
                                                            <Truck className="w-4 h-4" /> CekResi.com
                                                        </a>
                                                        <a
                                                            href={`https://www.google.com/search?q=cek+resi+${order.resi}`}
                                                            target="_blank"
                                                            className="flex-1 bg-white border border-slate-300 text-slate-700 rounded text-sm font-bold hover:bg-slate-50 shadow-sm text-center px-4 py-2 flex items-center justify-center gap-2"
                                                        >
                                                            <Search className="w-4 h-4" /> Google
                                                        </a>
                                                    </div>
                                                </>
                                            )}

                                            {order.status === 'DONE' && (
                                                <button className="px-6 py-2 bg-amber-500 text-white rounded text-sm font-bold hover:bg-amber-600 shadow-sm">
                                                    Beli Lagi
                                                </button>
                                            )}
                                        </div>

                                        {/* Info Pengiriman if Shipped */}
                                        {order.status === 'SHIPPED' && (
                                            <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 flex gap-2 items-start mt-1">
                                                <Truck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-green-700">Paket sedang dalam perjalanan</p>
                                                    <p>Nomor Resi: <span className="font-mono font-bold text-slate-800">{order.resi}</span></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Tracking Module...</div>}>
            <TrackPageContent />
        </Suspense>
    );
}
