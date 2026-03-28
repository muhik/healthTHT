import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { search } = body;

        if (!search) {
            return NextResponse.json({ error: 'Mohon masukkan Nomor HP atau ID Pesanan' }, { status: 400 });
        }

        // Search by ID (Exact) or Phone (Exact) using @libsql/client
        const result = await db.execute({
            sql: `
                SELECT id, date, name, status, amount, resi, courier, payment_url, created_at 
                FROM transactions 
                WHERE id = ? OR phone = ?
                ORDER BY created_at DESC
            `,
            args: [search, search]
        });

        const transactions = result.rows;

        if (transactions.length === 0) {
            return NextResponse.json({ error: 'Pesanan tidak ditemukan. Cek kembali Nomor HP / Order ID Anda.' }, { status: 404 });
        }

        return NextResponse.json({ orders: transactions });
    } catch (error) {
        console.error('Track API Error:', error);
        return NextResponse.json({ error: 'Gagal mencari pesanan' }, { status: 500 });
    }
}
