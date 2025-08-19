import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">💰</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">SmartPOS</span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="mb-6">
                        <span className="inline-block text-6xl mb-4">🏪</span>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Sistem POS untuk 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> UMKM</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Kelola toko Anda dengan mudah - dari manajemen produk hingga laporan penjualan, 
                            semua dalam satu platform yang sederhana dan powerful.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Link href="/register">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                🚀 Mulai Gratis Sekarang
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">
                                📱 Demo Aplikasi
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
                    {/* Feature 1 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">📦</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Manajemen Produk</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Tambah, edit, dan kelola produk dengan mudah. Atur kategori, stok, dan harga dalam satu dashboard.
                        </p>
                        <ul className="mt-4 text-sm text-gray-500 space-y-1">
                            <li>✓ Kategorisasi produk</li>
                            <li>✓ Tracking stok otomatis</li>
                            <li>✓ Alert stok menipis</li>
                        </ul>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">💳</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Sistem Kasir</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Interface kasir yang intuitif untuk proses transaksi yang cepat dan akurat.
                        </p>
                        <ul className="mt-4 text-sm text-gray-500 space-y-1">
                            <li>✓ Scan barcode</li>
                            <li>✓ Multiple payment methods</li>
                            <li>✓ Print receipt</li>
                        </ul>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">📊</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Laporan & Analisis</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Dapatkan insight mendalam tentang penjualan dan performa toko Anda.
                        </p>
                        <ul className="mt-4 text-sm text-gray-500 space-y-1">
                            <li>✓ Laporan harian/bulanan</li>
                            <li>✓ Analisis produk terlaris</li>
                            <li>✓ Grafik penjualan</li>
                        </ul>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">📱</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsive Design</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Akses dari mana saja - desktop, tablet, atau smartphone dengan tampilan yang optimal.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">👥</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-User</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Kelola multiple kasir dengan sistem login yang aman dan tracking aktivitas.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cepat & Reliable</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Performa tinggi dengan teknologi modern untuk mendukung operasional harian toko.
                        </p>
                    </div>
                </div>

                {/* Demo Section */}
                <div className="mt-20 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">🎯 Siap Meningkatkan Bisnis Anda?</h2>
                        <p className="text-lg mb-8 text-blue-100">
                            Join ribuan UMKM yang sudah menggunakan SmartPOS untuk mengoptimalkan penjualan mereka.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary">
                                    ✨ Daftar Sekarang - GRATIS
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                        <div className="text-gray-600">UMKM Terdaftar</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
                        <div className="text-gray-600">Transaksi/Bulan</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                        <div className="text-gray-600">Uptime</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">💰</span>
                        </div>
                        <span className="text-lg font-bold">SmartPOS</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Solusi Point of Sale terbaik untuk UMKM Indonesia
                    </p>
                    <p className="text-sm text-gray-500">
                        © 2024 SmartPOS. Built with ❤️ untuk UMKM Indonesia.
                    </p>
                </div>
            </footer>
        </div>
    );
}