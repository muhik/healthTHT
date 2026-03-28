'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Package, BarChart2, DollarSign, ArrowRight, Users, Settings, Save, X, Eye, Bell, CheckCircle, Clock, Truck, Send, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { initialTransactions, PIXEL_ID as DEFAULT_PIXEL_ID } from '@/lib/data';
import Toast from '@/components/ui/Toast';

export default function AdminDashboard() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]); // Start with empty array, fetch from API
    const [pixelId, setPixelId] = useState('');
    const [isSavingPixel, setIsSavingPixel] = useState(false);

    // Modal State
    // Modal State
    const [selectedTrx, setSelectedTrx] = useState<any>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // A3: Settings Modal
    const [isAuthorized, setIsAuthorized] = useState(false); // C1: Auth State

    // Settings State
    const [inputPixelId, setInputPixelId] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [savedPassword, setSavedPassword] = useState('proseal2026'); // Default C1

    // A6: Order Workflow State
    const [isResiModalOpen, setIsResiModalOpen] = useState(false);
    const [inputResi, setInputResi] = useState('');
    const [processingTrxId, setProcessingTrxId] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Notification State (A4)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // Notification Center State (A5)
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close notif dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // C1: Cek otentikasi
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_token');
            if (token !== 'authenticated_by_opus_c1') {
                router.replace('/admin/login');
                return;
            }
            setIsAuthorized(true);

            // Load Transactions (Fetch from SQLite API)
            fetch('/api/transactions')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setTransactions(data);
                    } else {
                        console.error('Format data salah:', data);
                    }
                })
                .catch(err => {
                    setToast({ message: 'Gagal memuat data transaksi', type: 'error' });
                });

            // Check for PAID orders on load (New Feature)
            setTimeout(() => {
                const paidOrders = transactions.filter((t: any) => t.status === 'PAID');
                if (paidOrders.length > 0) {
                    setToast({ message: `Ada ${paidOrders.length} pesanan yang SUDAH DIBAYAR! Segera proses.`, type: 'success' });
                    // Play notification sound if desired (optional)
                }
            }, 1000);

            // Load Pixel ID
            // Load Pixel ID
            const storedPixel = localStorage.getItem('pixel_id');
            const currentPixel = storedPixel || DEFAULT_PIXEL_ID;
            setPixelId(currentPixel);
            setInputPixelId(currentPixel);

            // Load Password (C2)
            const storedPass = localStorage.getItem('admin_password');
            if (storedPass) {
                setSavedPassword(storedPass);
            }
        }
    }, []);

    const handleSaveSettings = () => {
        setIsSavingPixel(true);

        // Save Pixel
        localStorage.setItem('pixel_id', inputPixelId);
        setPixelId(inputPixelId);

        // Save Password if changed
        if (inputPassword) {
            localStorage.setItem('admin_password', inputPassword);
            setSavedPassword(inputPassword);
        }

        setTimeout(() => {
            setIsSavingPixel(false);
            setIsSettingsOpen(false);
            setToast({ message: 'Konfigurasi Berhasil Disimpan!', type: 'success' });
        }, 800);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.replace('/admin/login');
    };

    // A6: Update Status Logic
    const updateStatus = async (id: string, newStatus: string, resi: string | null = null) => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus, resi }),
            });

            if (response.ok) {
                setTransactions(prev => prev.map(t =>
                    t.id === id ? { ...t, status: newStatus, resi: resi || t.resi } : t
                ));

                // Update selectedTrx if open
                if (selectedTrx && selectedTrx.id === id) {
                    setSelectedTrx((prev: any) => ({ ...prev, status: newStatus, resi: resi || prev.resi }));
                }

                setToast({ message: `Status berhasil diubah ke ${newStatus}`, type: 'success' });
                setIsResiModalOpen(false);
                setInputResi('');
                setProcessingTrxId(null);
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error(error);
            setToast({ message: 'Gagal update status', type: 'error' });
        }
    };

    const handleProcessOrder = (id: string) => {
        if (confirm('Proses pesanan ini?')) {
            updateStatus(id, 'PROCESSED');
        }
    };

    const openResiModal = (id: string) => {
        setProcessingTrxId(id);
        setIsResiModalOpen(true);
    };

    const handleShipOrder = () => {
        if (!inputResi) return alert('Masukkan nomor resi!');
        if (processingTrxId) {
            updateStatus(processingTrxId, 'SHIPPED', inputResi);
        }
    };

    const handleCompleteOrder = (id: string) => {
        if (confirm('Pesanan sudah diterima pelanggan?')) {
            updateStatus(id, 'DONE');
        }
    };

    const generateWALink = (trx: any) => {
        let message = '';
        if (trx.status === 'LEAD') {
            message = `Halo Kak ${trx.name}, terima kasih sudah order di Proseal. Silakan selesaikan pembayaran sebesar Rp ${trx.amount.toLocaleString()} ya kak agar segera diproses.`;
        } else if (trx.status === 'PAID') {
            message = `Halo Kak ${trx.name}, pembayaran Rp ${trx.amount.toLocaleString()} sudah kami terima. Pesanan sedang kami siapkan ya!`;
        } else if (trx.status === 'PROCESSED') {
            message = `Halo Kak ${trx.name}, pesanan Kakak sedang dikemas dan akan segera dikirim hari ini.`;
        } else if (trx.status === 'SHIPPED') {
            message = `Halo Kak ${trx.name}, paket sudah dikirim ya! Ini No Resi-nya: ${trx.resi}. Bisa dicek berkala ya kak. Terima kasih!`;
        } else if (trx.status === 'DONE') {
            message = `Halo Kak ${trx.name}, terima kasih sudah belanja di Proseal. Ditunggu orderan selanjutnya ya!`;
        }
        return `https://wa.me/${trx.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    };

    const totalSales = transactions
        .filter((t: any) => ['PAID', 'PROCESSED', 'SHIPPED', 'DONE'].includes(t.status))
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const leadsCount = transactions.length;
    const paidCount = transactions.filter((t: any) => ['PAID', 'PROCESSED', 'SHIPPED', 'DONE'].includes(t.status)).length;

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Prevent flashing content before redirect
    if (!isAuthorized) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold">Checking Access...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex">
            {/* Sidebar Sederhana */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="w-64 bg-slate-900 text-white p-6 hidden md:block">
                <h3 className="text-xl font-bold mb-10 text-amber-500">ADMIN PANEL</h3>
                <nav className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg text-amber-500 font-bold">
                        <BarChart2 className="w-5 h-5" /> Dashboard
                    </div>
                    <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white cursor-not-allowed">
                        <Package className="w-5 h-5" /> Produk
                    </div>
                    <div onClick={() => router.push('/')} className="flex items-center gap-3 p-3 text-slate-400 hover:text-white cursor-pointer mt-10 border-t border-slate-800 pt-6">
                        <ArrowRight className="w-5 h-5" /> Lihat Website
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-slate-800">Ringkasan Penjualan</h2>

                    <div className="flex gap-3">
                        {/* Notification Bell (A5) */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="bg-white hover:bg-slate-50 text-slate-600 p-3 rounded-xl shadow-sm border border-slate-200 transition relative"
                            >
                                <Bell className="w-5 h-5" />
                                {transactions.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h4 className="font-bold text-slate-800 text-sm">Notifikasi</h4>
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{transactions.length} Baru</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {transactions.slice(0, 5).map((trx: any, idx: number) => (
                                            <div key={idx} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer flex gap-3 items-start">
                                                <div className={`p-2 rounded-full flex-shrink-0 ${trx.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {trx.status === 'PAID' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">
                                                        {trx.status === 'PAID' ? 'Pembayaran Sukses!' : 'Pesanan Baru Masuk!'}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                        {trx.status === 'PAID'
                                                            ? `Rp ${trx.amount.toLocaleString()} dari ${trx.name}`
                                                            : `${trx.name} baru saja checkout.`}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-2">{trx.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {transactions.length === 0 && (
                                            <div className="p-8 text-center text-slate-400 text-xs">Belum ada notifikasi.</div>
                                        )}
                                    </div>
                                    <div className="p-2 bg-slate-50 text-center">
                                        <button onClick={() => setIsNotifOpen(false)} className="text-xs text-amber-600 font-bold hover:underline">
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 transition"
                        >
                            <Settings className="w-5 h-5" /> Pengaturan
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-5 rounded-xl shadow-sm flex items-center gap-2 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-slate-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
                                <h4 className="text-3xl font-black text-slate-800">{leadsCount}</h4>
                            </div>
                            <Users className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-xs text-slate-400">Orang mengisi form / masuk keranjang</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Konversi (Sales)</p>
                                <h4 className="text-3xl font-black text-slate-800">{paidCount}</h4>
                            </div>
                            <Package className="w-8 h-8 text-amber-200" />
                        </div>
                        <p className="text-xs text-slate-400">Total paket terjual</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 bg-emerald-50/50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Omset Masuk</p>
                                <h4 className="text-3xl font-black text-emerald-800">Rp {totalSales.toLocaleString()}</h4>
                            </div>
                            <DollarSign className="w-8 h-8 text-emerald-200" />
                        </div>
                        <p className="text-xs text-emerald-600 font-medium">Sudah dipotong diskon</p>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Transaksi Terbaru</h3>
                        <button className="text-sm text-amber-600 font-bold hover:underline">Export CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Tanggal</th>
                                    <th className="p-4">Pelanggan</th>
                                    <th className="p-4">Lokasi</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Nilai</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentTransactions.map((trx: any, index: number) => (
                                    <tr key={index} className="hover:bg-slate-50 transition">
                                        <td className="p-4 text-slate-500">{trx.date}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{trx.name}</div>
                                            <div className="text-xs text-slate-400">{trx.phone}</div>
                                        </td>
                                        <td className="p-4 text-slate-600">{trx.location}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${trx.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                                trx.status === 'LEAD' ? 'bg-amber-100 text-amber-700' :
                                                    trx.status === 'PROCESSED' ? 'bg-slate-100 text-slate-700' :
                                                        trx.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                                                            trx.status === 'DONE' ? 'bg-slate-200 text-slate-700' :
                                                                trx.status === 'RETURNED' ? 'bg-red-100 text-red-700' :
                                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-slate-800">
                                            Rp {trx.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedTrx(trx)}
                                                className="text-slate-400 hover:text-amber-500 transition"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {transactions.length === 0 && (
                        <div className="p-8 text-center text-slate-400">Belum ada data transaksi.</div>
                    )}

                    {/* Pagination Controls */}
                    {transactions.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t border-slate-100 gap-4">
                            <span className="text-sm text-slate-500">
                                Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, transactions.length)} dari {transactions.length} transaksi
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${currentPage === i + 1 ? 'bg-amber-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Transaksi */}
            {selectedTrx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-amber-500" /> Detail Transaksi
                            </h3>
                            <button onClick={() => setSelectedTrx(null)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500 text-sm">ID Transaksi</span>
                                <span className="font-mono font-bold text-slate-800">{selectedTrx.id}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500 text-sm">Status</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedTrx.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {selectedTrx.status}
                                </span>
                            </div>

                            {/* Actions (A6) */}
                            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi Pesanan</p>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={generateWALink(selectedTrx)}
                                        target="_blank"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                    >
                                        <Send className="w-4 h-4" /> Chat WA
                                    </a>

                                    {(selectedTrx.status === 'LEAD' || selectedTrx.status === 'PENDING') && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Tandai pesanan ini sudah lunas?')) {
                                                    updateStatus(selectedTrx.id, 'PAID');
                                                }
                                            }}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Tandai Lunas
                                        </button>
                                    )}

                                    {selectedTrx.status === 'PAID' && (
                                        <>
                                            <button
                                                onClick={() => handleProcessOrder(selectedTrx.id)}
                                                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                            >
                                                <Package className="w-4 h-4" /> Proses (Kemas)
                                            </button>
                                            {/* Allow direct shipping from PAID (Skip Processed) */}
                                            <button
                                                onClick={() => openResiModal(selectedTrx.id)}
                                                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                            >
                                                <Truck className="w-4 h-4" /> Langsung Kirim
                                            </button>
                                        </>
                                    )}

                                    {selectedTrx.status === 'PROCESSED' && (
                                        <button
                                            onClick={() => openResiModal(selectedTrx.id)}
                                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                        >
                                            <Truck className="w-4 h-4" /> Kirim (Input Resi)
                                        </button>
                                    )}

                                    {selectedTrx.status === 'SHIPPED' && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Ubah status jadi Retur/Bermasalah?')) {
                                                        updateStatus(selectedTrx.id, 'RETURNED');
                                                    }
                                                }}
                                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                            >
                                                <AlertCircle className="w-4 h-4" /> Retur
                                            </button>
                                            <a
                                                href={`https://cekresi.com/?noresi=${selectedTrx.resi}`}
                                                target="_blank"
                                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                            >
                                                <Eye className="w-4 h-4" /> Cek Resi
                                            </a>
                                            <button
                                                onClick={() => handleCompleteOrder(selectedTrx.id)}
                                                className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Selesai
                                            </button>
                                        </>
                                    )}

                                    {selectedTrx.status === 'RETURNED' && (
                                        <div className="w-full bg-red-50 text-red-700 p-2 rounded text-center text-xs font-bold">
                                            Pesanan Dikembalikan / Bermasalah
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-slate-500 text-xs mb-1">Nama Pelanggan</span>
                                    <span className="font-bold text-slate-800">{selectedTrx.name}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs mb-1">Nomor WhatsApp</span>
                                    <span className="font-bold text-slate-800">{selectedTrx.phone}</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs mb-1">Alamat Pengiriman</span>
                                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {selectedTrx.address || '-'} <br />
                                    <strong>{selectedTrx.location}</strong>
                                </p>
                            </div>
                            {selectedTrx.resi && (
                                <div>
                                    <span className="block text-purple-600 font-bold text-xs mb-1">Nomor Resi</span>
                                    <p className="text-lg font-mono font-black text-slate-800 bg-purple-50 p-3 rounded-lg border border-purple-100 tracking-wider">
                                        {selectedTrx.resi}
                                    </p>
                                </div>
                            )}
                            <div className="pt-2">
                                <span className="block text-slate-500 text-xs mb-1">Catatan (Note)</span>
                                <p className="text-xs text-slate-600 italic">
                                    {selectedTrx.note || 'Tidak ada catatan.'}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setSelectedTrx(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg transition">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Settings */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <Settings className="w-5 h-5 text-amber-500" /> Pengaturan Sistem
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Pixel Config */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Facebook Pixel ID
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1 rounded-md">
                                        <BarChart2 className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={inputPixelId}
                                        onChange={(e) => setInputPixelId(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                                        placeholder="Contoh: 1234567890"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">ID ini digunakan untuk tracking iklan.</p>
                            </div>

                            {/* Password Config */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Ganti Password Admin
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1 rounded-md">
                                        <Users className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={inputPassword}
                                        onChange={(e) => setInputPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                                        placeholder="Ketik password baru..."
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Password saat ini: <span className="font-mono bg-slate-100 px-1 rounded">{savedPassword}</span>
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <button onClick={() => setIsSettingsOpen(false)} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-200 transition">
                                Batal
                            </button>
                            <button onClick={handleSaveSettings} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-lg shadow-lg shadow-amber-500/20 transition flex items-center gap-2">
                                <Save className="w-4 h-4" /> Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Input Resi */}
            {isResiModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-purple-900 p-4 text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <Truck className="w-5 h-5 text-purple-400" /> Input Nomor Resi
                            </h3>
                        </div>
                        <div className="p-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Nomor Resi Pengiriman
                            </label>
                            <input
                                type="text"
                                value={inputResi}
                                onChange={(e) => setInputResi(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition mb-4"
                                placeholder="Contoh: JP1234567890"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setIsResiModalOpen(false)} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-200 transition">
                                    Batal
                                </button>
                                <button onClick={handleShipOrder} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-purple-500/20 transition">
                                    Kirim Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
