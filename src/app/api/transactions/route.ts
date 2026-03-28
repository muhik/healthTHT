import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Get specific transaction by ID
            const result = await db.execute({
                sql: 'SELECT * FROM transactions WHERE id = ?',
                args: [id]
            });
            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
            }
            return NextResponse.json(result.rows[0]);
        }

        // Get all transactions
        const result = await db.execute('SELECT * FROM transactions ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, date, name, phone, location, status, amount, address, note, payment_url } = body;

        await db.execute({
            sql: `
                INSERT INTO transactions (id, date, name, phone, location, status, amount, address, note, payment_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [id, date, name, phone, location, status, amount, address, note, payment_url || null]
        });

        return NextResponse.json({ message: 'Transaction saved successfully' });
    } catch (error) {
        console.error('Database Save Error:', error);
        return NextResponse.json({ error: 'Failed to save transaction' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, status, resi, courier } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Mission ID or Status' }, { status: 400 });
        }

        await db.execute({
            sql: `
                UPDATE transactions 
                SET status = ?, resi = ?, courier = ?
                WHERE id = ?
            `,
            args: [status, resi || null, courier || null, id]
        });

        return NextResponse.json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('Database Update Error:', error);
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }
}
