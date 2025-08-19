<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = [
            'Nasi Kotak Ayam',
            'Minuman Teh Botol',
            'Roti Tawar',
            'Mie Instan',
            'Kopi Sachetan',
            'Air Mineral 600ml',
            'Snack Keripik',
            'Permen Mint',
            'Coklat Batang',
            'Biskuit Marie'
        ];

        $stock = fake()->numberBetween(10, 100);
        $minStock = fake()->numberBetween(5, 15);

        return [
            'name' => fake()->randomElement($products),
            'sku' => 'PRD-' . fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 1000, 50000), // Price between 1k - 50k
            'stock' => $stock,
            'min_stock' => $minStock,
            'category_id' => Category::factory(),
            'image' => null,
            'is_active' => fake()->boolean(95), // 95% chance of being active
        ];
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => fake()->numberBetween(0, 5),
            'min_stock' => fake()->numberBetween(5, 10),
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }
}