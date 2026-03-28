'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // setError(''); // Removed as we use toast now

        // C1/C2: Simple Auth Logic with Dynamic Password
        setTimeout(() => {
            const storedPass = localStorage.getItem('admin_password');
            const currentPass = storedPass || 'proseal2026';

            if (password === currentPass) {
                localStorage.setItem('admin_token', 'authenticated_by_opus_c1');
                setToast({ message: 'Login Berhasil!', type: 'success' });
                setTimeout(() => router.push('/admin'), 1000);
            } else {
                setToast({ message: 'Password salah! Akses ditolak.', type: 'error' });
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
                <div className="text-center mb-8">
                    <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                        <Shield className="w-8 h-8 text-white fill-current" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
                    <p className="text-slate-400 text-sm mt-2">Masukan password untuk akses dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password Admin"
                            className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition placeholder:text-slate-500"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password Admin"
                            className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition placeholder:text-slate-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-4 rounded-xl text-lg shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Verifikasi...
                            </>
                        ) : (
                            <>
                                Masuk <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-500">
                        System by <strong className="text-slate-400">Gemini (A)</strong> & <strong className="text-slate-400">Opus (C)</strong>
                    </p>
                </div>
                <div className="text-center mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-500">
                        System by <strong className="text-slate-400">Gemini (A)</strong> & <strong className="text-slate-400">Opus (C)</strong>
                    </p>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
