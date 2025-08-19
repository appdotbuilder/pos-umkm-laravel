<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Product name');
            $table->string('sku')->unique()->comment('Stock Keeping Unit');
            $table->text('description')->nullable()->comment('Product description');
            $table->decimal('price', 10, 2)->comment('Product price');
            $table->integer('stock')->default(0)->comment('Current stock quantity');
            $table->integer('min_stock')->default(0)->comment('Minimum stock alert level');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('image')->nullable()->comment('Product image path');
            $table->boolean('is_active')->default(true)->comment('Product status');
            $table->timestamps();
            
            $table->index('name');
            $table->index('sku');
            $table->index('category_id');
            $table->index('is_active');
            $table->index(['is_active', 'stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};