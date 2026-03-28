export const PIXEL_ID = "1234567890"; // Ganti dengan Pixel ID Iklan kamu
export const MAYAR_API_KEY = "YOUR_MAYAR_API_KEY"; // API Key Mayar (Nanti diisi)

// --- MOCK DATA ---
// Data dummy untuk Admin Dashboard
export const initialTransactions = [
  { id: 'TRX-001', name: 'Budi Santoso', phone: '08123456789', location: 'Jakarta Selatan', status: 'PAID', amount: 149000, date: '2026-02-14' },
  { id: 'TRX-002', name: 'Iwan Fals', phone: '08198765432', location: 'Depok', status: 'PENDING', amount: 149000, date: '2026-02-14' },
  { id: 'TRX-003', name: 'Rina Nose', phone: '08567891234', location: 'Surabaya', status: 'LEAD', amount: 0, date: '2026-02-13' },
];

export const trackPixel = (event: string, data = {}) => {
  console.log(`🔥 PIXEL FIRED: ${event}`, data);
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, data);
  }
};
