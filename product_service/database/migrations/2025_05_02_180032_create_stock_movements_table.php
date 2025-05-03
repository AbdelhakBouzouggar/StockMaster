<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{//
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained('products')->onDelete('cascade');
            $table->enum('type_mouvement', ['entrée', 'sortie', 'ajustement', 'transfert']);
            $table->integer('quantite');
            $table->foreignId('utilisateur_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_mouvement')->useCurrent();
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};