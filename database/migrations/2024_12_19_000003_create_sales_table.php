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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique()->comment('Invoice number');
            $table->foreignId('user_id')->constrained();
            $table->decimal('subtotal', 12, 2)->comment('Subtotal before tax');
            $table->decimal('tax_amount', 12, 2)->default(0)->comment('Tax amount');
            $table->decimal('discount_amount', 12, 2)->default(0)->comment('Discount amount');
            $table->decimal('total_amount', 12, 2)->comment('Final total amount');
            $table->decimal('cash_received', 12, 2)->comment('Cash received from customer');
            $table->decimal('change_amount', 12, 2)->comment('Change given to customer');
            $table->enum('payment_method', ['cash', 'card', 'transfer'])->default('cash');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            $table->index('invoice_number');
            $table->index('user_id');
            $table->index('status');
            $table->index('payment_method');
            $table->index(['created_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};