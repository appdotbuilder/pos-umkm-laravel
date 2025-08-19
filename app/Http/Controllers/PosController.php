<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display the POS interface.
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->active()->inStock();
        
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        $products = $query->get();
        $categories = Category::active()->get();
        
        return Inertia::render('pos/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category_id' => $request->category_id,
            ]
        ]);
    }

    /**
     * Process a new sale.
     */
    public function store(StoreSaleRequest $request)
    {
        try {
            DB::beginTransaction();
            
            $items = $request->validated()['items'];
            $subtotal = 0;
            
            // Calculate subtotal and validate stock
            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                
                if (!$product || $product->stock < $item['quantity']) {
                    throw new \Exception('Insufficient stock for product: ' . ($product->name ?? 'Unknown'));
                }
                
                $subtotal += $item['quantity'] * $item['unit_price'];
            }
            
            $taxAmount = $subtotal * 0.1; // 10% tax
            $totalAmount = $subtotal + $taxAmount;
            $cashReceived = $request->validated()['cash_received'];
            $changeAmount = $cashReceived - $totalAmount;
            
            if ($changeAmount < 0) {
                throw new \Exception('Insufficient cash received.');
            }
            
            // Create sale
            $sale = Sale::create([
                'invoice_number' => Sale::generateInvoiceNumber(),
                'user_id' => auth()->id(),
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'cash_received' => $cashReceived,
                'change_amount' => $changeAmount,
                'payment_method' => $request->validated()['payment_method'],
                'status' => 'completed',
                'notes' => $request->validated()['notes'] ?? null,
            ]);
            
            // Create sale items and reduce stock
            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
                
                $product->reduceStock($item['quantity']);
            }
            
            DB::commit();
            
            return Inertia::render('pos/receipt', [
                'sale' => $sale->load('saleItems.product', 'user')
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show receipt for a sale.
     */
    public function show(Sale $sale)
    {
        $sale->load('saleItems.product', 'user');
        
        return Inertia::render('pos/receipt', [
            'sale' => $sale
        ]);
    }
}