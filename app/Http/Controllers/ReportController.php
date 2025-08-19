<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display sales reports.
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'daily');
        
        // Today's sales
        $todaySales = Sale::today()->completed()->sum('total_amount');
        $todayTransactions = Sale::today()->completed()->count();
        
        // This month's sales
        $monthSales = Sale::thisMonth()->completed()->sum('total_amount');
        $monthTransactions = Sale::thisMonth()->completed()->count();
        
        // Chart data based on period
        $chartData = $this->getChartData($period);
        
        // Top products
        $topProducts = \DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'completed')
            ->selectRaw('products.name, SUM(sale_items.quantity) as total_quantity, SUM(sale_items.total_price) as total_revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();
        
        return Inertia::render('reports/index', [
            'todaySales' => $todaySales,
            'todayTransactions' => $todayTransactions,
            'monthSales' => $monthSales,
            'monthTransactions' => $monthTransactions,
            'chartData' => $chartData,
            'topProducts' => $topProducts,
            'period' => $period,
        ]);
    }

    /**
     * Get chart data for reports.
     */
    protected function getChartData(string $period): array
    {
        $query = Sale::completed();
        
        switch ($period) {
            case 'daily':
                // Last 30 days
                $data = $query
                    ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total, COUNT(*) as transactions')
                    ->where('created_at', '>=', now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();
                break;
                
            case 'weekly':
                // Last 12 weeks
                $data = $query
                    ->selectRaw('YEARWEEK(created_at) as period, SUM(total_amount) as total, COUNT(*) as transactions')
                    ->where('created_at', '>=', now()->subWeeks(12))
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get();
                break;
                
            case 'monthly':
                // Last 12 months
                $data = $query
                    ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_amount) as total, COUNT(*) as transactions')
                    ->where('created_at', '>=', now()->subYear())
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();
                break;
                
            default:
                $data = collect();
        }
        
        return $data->toArray();
    }
}