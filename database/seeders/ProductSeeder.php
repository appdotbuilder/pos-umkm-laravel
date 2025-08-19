<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            return;
        }

        $products = [
            // Makanan & Minuman
            ['name' => 'Nasi Kotak Ayam', 'price' => 15000, 'category' => 'Makanan & Minuman'],
            ['name' => 'Nasi Kotak Ikan', 'price' => 12000, 'category' => 'Makanan & Minuman'],
            ['name' => 'Teh Botol Sosro', 'price' => 5000, 'category' => 'Makanan & Minuman'],
            ['name' => 'Air Mineral 600ml', 'price' => 3000, 'category' => 'Makanan & Minuman'],
            ['name' => 'Kopi Kapal Api', 'price' => 2000, 'category' => 'Makanan & Minuman'],
            
            // Elektronik
            ['name' => 'Charger HP Universal', 'price' => 25000, 'category' => 'Elektronik'],
            ['name' => 'Powerbank 10000mAh', 'price' => 150000, 'category' => 'Elektronik'],
            ['name' => 'Kabel USB Type-C', 'price' => 15000, 'category' => 'Elektronik'],
            
            // Alat Tulis
            ['name' => 'Pulpen Pilot', 'price' => 3000, 'category' => 'Alat Tulis'],
            ['name' => 'Buku Tulis 58 Lembar', 'price' => 5000, 'category' => 'Alat Tulis'],
            ['name' => 'Penghapus Stedtler', 'price' => 2000, 'category' => 'Alat Tulis'],
            
            // Rumah Tangga
            ['name' => 'Sabun Cuci Piring', 'price' => 8000, 'category' => 'Rumah Tangga'],
            ['name' => 'Tissue Paseo', 'price' => 12000, 'category' => 'Rumah Tangga'],
            ['name' => 'Kantong Plastik', 'price' => 5000, 'category' => 'Rumah Tangga'],
        ];

        foreach ($products as $productData) {
            $category = $categories->where('name', $productData['category'])->first();
            
            if ($category) {
                Product::create([
                    'name' => $productData['name'],
                    'sku' => 'SKU' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
                    'description' => 'Deskripsi untuk ' . $productData['name'],
                    'price' => $productData['price'],
                    'stock' => random_int(20, 100),
                    'min_stock' => random_int(5, 15),
                    'category_id' => $category->id,
                    'is_active' => true,
                ]);
            }
        }

        // Create some additional random products
        Product::factory(30)->create([
            'category_id' => fn() => $categories->random()->id,
        ]);
    }
}