<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Makanan & Minuman',
                'description' => 'Produk makanan dan minuman',
                'is_active' => true,
            ],
            [
                'name' => 'Elektronik',
                'description' => 'Perangkat elektronik dan gadget',
                'is_active' => true,
            ],
            [
                'name' => 'Pakaian',
                'description' => 'Pakaian dan aksesoris',
                'is_active' => true,
            ],
            [
                'name' => 'Kesehatan & Kecantikan',
                'description' => 'Produk kesehatan dan kecantikan',
                'is_active' => true,
            ],
            [
                'name' => 'Rumah Tangga',
                'description' => 'Perlengkapan rumah tangga',
                'is_active' => true,
            ],
            [
                'name' => 'Alat Tulis',
                'description' => 'Alat tulis dan perlengkapan kantor',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}