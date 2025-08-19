import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface DashboardStats {
    today_sales: number;
    today_transactions: number;
    today_items: number;
    month_sales: number;
    month_transactions: number;
    total_products: number;
    low_stock_products: number;
    out_of_stock_products: number;
    total_categories: number;
}

interface Sale {
    id: number;
    invoice_number: string;
    total_amount: number;
    created_at: string;
    user: {
        name: string;
    };
    total_items: number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    min_stock: number;
    category: {
        name: string;
    };
}

interface TopProduct {
    name: string;
    sku: string;
    total_quantity: number;
    total_revenue: number;
}

interface Props {
    stats: DashboardStats;
    recent_sales: Sale[];
    low_stock_items: Product[];
    top_products: TopProduct[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, recent_sales, low_stock_items, top_products }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">🏪 Dashboard SmartPOS</h1>
                    <p className="text-blue-100">Selamat datang kembali! Mari lihat performa toko Anda hari ini.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Penjualan Hari Ini</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.today_sales)}</p>
                                <p className="text-sm text-gray-500">{stats.today_transactions} transaksi</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Penjualan Bulan Ini</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.month_sales)}</p>
                                <p className="text-sm text-gray-500">{stats.month_transactions} transaksi</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Produk</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                                <p className="text-sm text-gray-500">{stats.total_categories} kategori</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Stok Menipis</p>
                                <p className="text-2xl font-bold text-red-600">{stats.low_stock_products}</p>
                                <p className="text-sm text-gray-500">{stats.out_of_stock_products} habis stok</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link href="/pos">
                        <Button className="w-full h-16 bg-green-600 hover:bg-green-700 text-lg">
                            🛒 Mulai Transaksi
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="w-full h-16 text-lg">
                            📦 Kelola Produk
                        </Button>
                    </Link>
                    <Link href="/sales">
                        <Button variant="outline" className="w-full h-16 text-lg">
                            📋 Riwayat Penjualan
                        </Button>
                    </Link>
                    <Link href="/reports">
                        <Button variant="outline" className="w-full h-16 text-lg">
                            📊 Laporan
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Sales */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">🕒 Transaksi Terbaru</h2>
                            <Link href="/sales">
                                <Button variant="outline" size="sm">Lihat Semua</Button>
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recent_sales.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">📝</span>
                                    <p>Belum ada transaksi hari ini</p>
                                </div>
                            ) : (
                                recent_sales.map((sale) => (
                                    <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{sale.invoice_number}</p>
                                            <p className="text-sm text-gray-500">{sale.user.name} • {formatDate(sale.created_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatCurrency(sale.total_amount)}</p>
                                            <p className="text-sm text-gray-500">{sale.total_items} item</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">⚠️ Stok Menipis</h2>
                            <Link href="/products?status=low_stock">
                                <Button variant="outline" size="sm">Lihat Semua</Button>
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {low_stock_items.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">✅</span>
                                    <p>Semua produk stok aman</p>
                                </div>
                            ) : (
                                low_stock_items.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.sku} • {product.category.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-red-600">{product.stock} tersisa</p>
                                            <p className="text-sm text-gray-500">Min: {product.min_stock}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">🔥 Produk Terlaris Bulan Ini</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {top_products.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                <span className="text-4xl mb-2 block">📈</span>
                                <p>Belum ada data penjualan bulan ini</p>
                            </div>
                        ) : (
                            top_products.map((product, index) => (
                                <div key={product.sku} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-2xl">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                                        </span>
                                        <span className="text-sm text-gray-500">#{index + 1}</span>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{product.total_quantity} terjual</span>
                                        <span className="font-medium text-green-600">{formatCurrency(product.total_revenue)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}