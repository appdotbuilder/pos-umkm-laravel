import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
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
    category: Category;
}

interface CartItem extends Product {
    quantity: number;
    total: number;
}

interface Props {
    products: Product[];
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Point of Sale', href: '/pos' },
];

export default function PosIndex({ products, categories, filters }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [cashReceived, setCashReceived] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const cartSubtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.total, 0);
    }, [cart]);

    const taxAmount = useMemo(() => {
        return cartSubtotal * 0.1; // 10% tax
    }, [cartSubtotal]);

    const totalAmount = useMemo(() => {
        return cartSubtotal + taxAmount;
    }, [cartSubtotal, taxAmount]);

    const changeAmount = useMemo(() => {
        const cash = parseFloat(cashReceived) || 0;
        return cash - totalAmount;
    }, [cashReceived, totalAmount]);

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                setCart(cart.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                        : item
                ));
            }
        } else {
            setCart([...cart, { 
                ...product, 
                quantity: 1, 
                total: product.price 
            }]);
        }
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const product = cart.find(item => item.id === productId);
        if (product && quantity <= product.stock) {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity, total: quantity * item.price }
                    : item
            ));
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setCashReceived('');
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        const cash = parseFloat(cashReceived) || 0;
        if (cash < totalAmount) {
            alert('Uang yang diterima kurang!');
            return;
        }

        setProcessing(true);
        
        const saleData = {
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
            })),
            cash_received: cash,
            payment_method: paymentMethod,
        };

        router.post(route('pos.store'), saleData, {
            onSuccess: () => {
                clearCart();
            },
            onError: (errors) => {
                console.error(errors);
                alert('Terjadi kesalahan saat memproses transaksi!');
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory) params.set('category_id', selectedCategory);
        
        router.get(route('pos.index'), Object.fromEntries(params), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppShell breadcrumbs={breadcrumbs}>
            <Head title="Point of Sale" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Products Section */}
                <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari produk atau SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <div className="w-full sm:w-48">
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
                            <Button onClick={handleFilter} className="whitespace-nowrap">
                                🔍 Filter
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">📦 Produk ({products.length})</h2>
                        </div>
                        
                        <div className="p-6 h-full overflow-y-auto">
                            {products.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <span className="text-6xl mb-4 block">🔍</span>
                                    <p className="text-lg mb-2">Produk tidak ditemukan</p>
                                    <p>Coba ubah kata kunci pencarian</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => addToCart(product)}
                                        >
                                            <div className="mb-3">
                                                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                                                <p className="text-sm text-gray-500">{product.sku}</p>
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md mt-1">
                                                    {product.category.name}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                                                    <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    disabled={product.stock === 0}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    ➕
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cart Section */}
                <div className="flex flex-col">
                    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">🛒 Keranjang ({cart.length})</h2>
                            {cart.length > 0 && (
                                <Button variant="outline" size="sm" onClick={clearCart}>
                                    🗑️ Kosongkan
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">🛒</span>
                                    <p>Keranjang kosong</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                            <p className="text-sm text-gray-500">{formatCurrency(item.price)} × {item.quantity}</p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 ml-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                ➖
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                            >
                                                ➕
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                ✖️
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <>
                                {/* Totals */}
                                <div className="space-y-2 py-4 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(cartSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Pajak (10%):</span>
                                        <span>{formatCurrency(taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span>{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="space-y-4 border-t pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Metode Pembayaran
                                        </label>
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">💰 Tunai</SelectItem>
                                                <SelectItem value="card">💳 Kartu</SelectItem>
                                                <SelectItem value="transfer">📱 Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Uang Diterima
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={cashReceived}
                                            onChange={(e) => setCashReceived(e.target.value)}
                                            className="text-right"
                                        />
                                    </div>

                                    {cashReceived && (
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Kembalian:</span>
                                            <span className={changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {formatCurrency(Math.max(0, changeAmount))}
                                            </span>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={processing || parseFloat(cashReceived) < totalAmount}
                                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                                    >
                                        {processing ? '⏳ Memproses...' : '💳 Bayar Sekarang'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}