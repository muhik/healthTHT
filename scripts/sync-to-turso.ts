import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://healththt-muhik.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_TOKEN) {
    console.error('Error: TURSO_AUTH_TOKEN tidak ditemukan!');
    console.error('Pastikan Anda telah mengatur environment variable TURSO_AUTH_TOKEN');
    process.exit(1);
}

async function syncToTurso() {
    console.log('🚀 Memulai sinkronisasi database ke Turso...');
    console.log(`📍 URL: ${TURSO_URL}`);

    // Connect to local SQLite
    console.log('📂 Membaca database lokal: proseal.db');
    const localDb = new Database('proseal.db');

    // Connect to Turso
    console.log('☁️  Menghubungkan ke Turso...');
    const tursoDb = createClient({
        url: TURSO_URL,
        authToken: TURSO_TOKEN,
    });

    try {
        // Test Turso connection
        await tursoDb.execute('SELECT 1');
        console.log('✅ Berhasil terhubung ke Turso!');

        // Create table in Turso if not exists
        console.log('🛠️  Membuat tabel transactions di Turso...');
        await tursoDb.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                location TEXT NOT NULL,
                status TEXT NOT NULL,
                amount INTEGER NOT NULL,
                address TEXT,
                note TEXT,
                resi TEXT,
                courier TEXT,
                payment_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabel berhasil dibuat/verifikasi');

        // Get data from local SQLite
        console.log('📥 Mengambil data dari database lokal...');
        const transactions = localDb.prepare('SELECT * FROM transactions').all() as any[];
        console.log(`📊 Ditemukan ${transactions.length} transaksi di database lokal`);

        if (transactions.length === 0) {
            console.log('ℹ️  Tidak ada data untuk disinkronkan');
            return;
        }

        // Clear existing data in Turso (optional - remove if you want to keep existing data)
        console.log('🧹 Membersihkan data lama di Turso...');
        await tursoDb.execute('DELETE FROM transactions');
        console.log('✅ Data lama berhasil dihapus');

        // Insert data into Turso
        console.log('📤 Menyinkronkan data ke Turso...');
        let successCount = 0;
        let errorCount = 0;

        for (const row of transactions) {
            try {
                await tursoDb.execute({
                    sql: `
                        INSERT INTO transactions 
                        (id, date, name, phone, location, status, amount, address, note, resi, courier, payment_url, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    args: [
                        row.id,
                        row.date,
                        row.name,
                        row.phone,
                        row.location,
                        row.status,
                        row.amount,
                        row.address || null,
                        row.note || null,
                        row.resi || null,
                        row.courier || null,
                        row.payment_url || null,
                        row.created_at || new Date().toISOString()
                    ]
                });
                successCount++;
            } catch (err) {
                console.error(`❌ Gagal menyinkronkan transaksi ${row.id}:`, err);
                errorCount++;
            }
        }

        console.log('\n📊 Ringkasan Sinkronisasi:');
        console.log(`   ✅ Berhasil: ${successCount} transaksi`);
        console.log(`   ❌ Gagal: ${errorCount} transaksi`);
        console.log(`   📈 Total: ${transactions.length} transaksi`);

        // Verify data in Turso
        console.log('\n🔍 Memverifikasi data di Turso...');
        const result = await tursoDb.execute('SELECT COUNT(*) as count FROM transactions');
        const tursoCount = result.rows[0]?.count;
        console.log(`   📊 Total data di Turso: ${tursoCount} transaksi`);

        if (Number(tursoCount) === transactions.length) {
            console.log('\n🎉 Sinkronisasi berhasil! Semua data telah tersinkronisasi.');
        } else {
            console.log('\n⚠️  Peringatan: Jumlah data tidak cocok. Silakan periksa log.');
        }

    } catch (error) {
        console.error('❌ Error saat sinkronisasi:', error);
        process.exit(1);
    } finally {
        localDb.close();
        console.log('\n👋 Koneksi ditutup.');
    }
}

// Run sync
syncToTurso().catch(console.error);
