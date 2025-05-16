<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyUtilisateurIdInStockMovements extends Migration
{
    public function up()
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropForeign(['utilisateur_id']);
            $table->string('utilisateur_id', 24)->change();
        });
    }

    public function down()
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->unsignedBigInteger('utilisateur_id')->change();
            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
}