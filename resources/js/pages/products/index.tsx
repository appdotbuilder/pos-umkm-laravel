import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    min_stock: number;
    is_active: boolean;
    is_low_stock: boolean;
    category: Category;
    created_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: Product[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    products: Pagination;
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
        status?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Produk', href: '/products' },
];

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory) params.set('category_id', selectedCategory);
        if (selectedStatus) params.set('status', selectedStatus);
        
        router.get(route('products.index'), Object.fromEntries(params), {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedStatus('');
        router.get(route('products.index'));
    };

    const getStatusBadge = (product: Product) => {
        if (!product.is_active) {
            return <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md">❌ Nonaktif</span>;
        }
        if (product.stock === 0) {
            return <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md">📦 Habis Stok</span>;
        }
        if (product.is_low_stock) {
            return <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md">⚠️ Stok Menipis</span>;
        }
        return <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">✅ Aktif</span>;
    };

    return (
        <AppShell breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Produk" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📦 Manajemen Produk</h1>
                        <p className="text-gray-600 mt-1">
                            Kelola produk dan stok toko Anda
                        </p>
                    </div>
                    <Link href="/products/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
                            ➕ Tambah Produk
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Input
                                placeholder="Cari produk atau SKU..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Kategori</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Status</SelectItem>
                                    <SelectItem value="active">✅ Aktif</SelectItem>
                                    <SelectItem value="inactive">❌ Nonaktif</SelectItem>
                                    <SelectItem value="low_stock">⚠️ Stok Menipis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={handleFilter} className="flex-1">
                                🔍 Filter
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                🗑️ Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Daftar Produk ({products.total})
                            </h2>
                            <div className="text-sm text-gray-500">
                                Menampilkan {products.data.length} dari {products.total} produk
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {products.data.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <span className="text-6xl mb-4 block">📦</span>
                                <p className="text-lg mb-2">Tidak ada produk ditemukan</p>
                                <p className="mb-4">Mulai dengan menambah produk pertama Anda</p>
                                <Link href="/products/create">
                                    <Button>➕ Tambah Produk</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product) => (
                                    <div
                                        key={product.id}
                                        className="border rounded-xl p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-mono">
                                                    {product.sku}
                                                </p>
                                            </div>
                                            <div className="ml-2">
                                                {getStatusBadge(product)}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Kategori:</span>
                                                <span className="font-medium">{product.category.name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Harga:</span>
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency(product.price)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Stok:</span>
                                                <span className={`font-medium ${
                                                    product.stock === 0 ? 'text-red-600' :
                                                    product.is_low_stock ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {product.stock} pcs
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Link href={`/products/${product.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    👁️ Lihat
                                                </Button>
                                            </Link>
                                            <Link href={`/products/${product.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    ✏️ Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="px-6 py-4 border-t">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Halaman {products.current_page} dari {products.last_page}
                                </div>
                                <div className="flex space-x-2">
                                    {products.links.map((link, index) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}