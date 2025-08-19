import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    sku: string;
}

interface SaleItem {
    id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: Product;
}

interface User {
    name: string;
}

interface Sale {
    id: number;
    invoice_number: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    cash_received: number;
    change_amount: number;
    payment_method: string;
    created_at: string;
    user: User;
    sale_items: SaleItem[];
}

interface Props {
    sale: Sale;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Point of Sale', href: '/pos' },
    { title: 'Struk', href: '#' },
];

export default function Receipt({ sale }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'cash': return '💰 Tunai';
            case 'card': return '💳 Kartu';
            case 'transfer': return '📱 Transfer';
            default: return method;
        }
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <AppShell breadcrumbs={breadcrumbs}>
            <Head title={`Struk - ${sale.invoice_number}`} />
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <h1 className="text-2xl font-bold mb-2">Transaksi Berhasil!</h1>
                        <p className="text-green-100">Terima kasih atas pembelian Anda</p>
                    </div>

                    {/* Receipt Content */}
                    <div className="p-8" id="receipt-content">
                        {/* Store Header */}
                        <div className="text-center border-b pb-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">🏪 SmartPOS</h2>
                            <p className="text-gray-600">Jl. Contoh No. 123, Jakarta</p>
                            <p className="text-gray-600">Telp: (021) 1234-5678</p>
                        </div>

                        {/* Transaction Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="text-gray-600">No. Invoice:</p>
                                <p className="font-mono font-semibold">{sale.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">Tanggal:</p>
                                <p className="font-semibold">{formatDate(sale.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Kasir:</p>
                                <p className="font-semibold">{sale.user.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">Pembayaran:</p>
                                <p className="font-semibold">{getPaymentMethodLabel(sale.payment_method)}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="border-t border-b py-6 mb-6">
                            <div className="space-y-3">
                                {sale.sale_items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(item.unit_price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(item.total_price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">{formatCurrency(sale.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Pajak (10%):</span>
                                <span className="font-semibold">{formatCurrency(sale.tax_amount)}</span>
                            </div>
                            {sale.discount_amount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Diskon:</span>
                                    <span className="font-semibold text-red-600">
                                        -{formatCurrency(sale.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-3">
                                <span>Total:</span>
                                <span>{formatCurrency(sale.total_amount)}</span>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Uang Diterima:</span>
                                <span className="font-semibold">{formatCurrency(sale.cash_received)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-green-600">
                                <span>Kembalian:</span>
                                <span>{formatCurrency(sale.change_amount)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-600 border-t pt-6">
                            <p className="mb-2">Terima kasih telah berbelanja!</p>
                            <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
                            <div className="mt-4 font-mono text-xs">
                                {sale.invoice_number}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-4 print:hidden">
                        <Button 
                            onClick={printReceipt}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            🖨️ Cetak Struk
                        </Button>
                        <Link href="/pos" className="flex-1">
                            <Button variant="outline" className="w-full">
                                🛒 Transaksi Baru
                            </Button>
                        </Link>
                        <Link href="/sales" className="flex-1">
                            <Button variant="outline" className="w-full">
                                📋 Riwayat Penjualan
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #receipt-content, #receipt-content * {
                        visibility: visible;
                    }
                    #receipt-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        font-size: 12px;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </AppShell>
    );
}