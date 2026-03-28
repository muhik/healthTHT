'use client';

import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        error: <AlertCircle className="w-5 h-5 text-red-600" />,
        warning: <ShieldAlert className="w-5 h-5 text-amber-600" />,
    };

    return (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${bgColors[type]}`}>
            {icons[type]}
            <p className="font-bold text-sm">{message}</p>
            <button onClick={onClose} className="hover:opacity-70 transition">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
