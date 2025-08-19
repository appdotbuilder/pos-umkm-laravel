<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Category;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        // Today's statistics
        $todaySales = Sale::today()->completed()->sum('total_amount');
        $todayTransactions = Sale::today()->completed()->count();
        $todayItems = Sale::today()->completed()->with('saleItems')->get()->sum('total_items');
        
        // This month's statistics
        $monthSales = Sale::thisMonth()->completed()->sum('total_amount');
        $monthTransactions = Sale::thisMonth()->completed()->count();
        
        // Product statistics
        $totalProducts = Product::active()->count();
        $lowStockProducts = Product::active()->lowStock()->count();
        $outOfStockProducts = Product::active()->where('stock', 0)->count();
        $totalCategories = Category::active()->count();
        
        // Recent sales
        $recentSales = Sale::with(['user', 'saleItems'])
            ->completed()
            ->latest()
            ->limit(5)
            ->get();
        
        // Low stock products
        $lowStockItems = Product::with('category')
            ->active()
            ->lowStock()
            ->orderBy('stock')
            ->limit(5)
            ->get();
        
        // Top selling products this month
        $topProducts = \DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'completed')
            ->whereMonth('sales.created_at', now()->month)
            ->whereYear('sales.created_at', now()->year)
            ->selectRaw('products.name, products.sku, SUM(sale_items.quantity) as total_quantity, SUM(sale_items.total_price) as total_revenue')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();
        
        return Inertia::render('dashboard', [
            'stats' => [
                'today_sales' => $todaySales,
                'today_transactions' => $todayTransactions,
                'today_items' => $todayItems,
                'month_sales' => $monthSales,
                'month_transactions' => $monthTransactions,
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'total_categories' => $totalCategories,
            ],
            'recent_sales' => $recentSales,
            'low_stock_items' => $lowStockItems,
            'top_products' => $topProducts,
        ]);
    }
}