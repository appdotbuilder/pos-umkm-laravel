<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@pos.com',
        ]);

        // Create cashier users
        User::factory()->create([
            'name' => 'Kasir 1',
            'email' => 'kasir1@pos.com',
        ]);

        User::factory()->create([
            'name' => 'Kasir 2',
            'email' => 'kasir2@pos.com',
        ]);

        // Seed categories and products
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
