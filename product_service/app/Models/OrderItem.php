<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
//
    protected $table = "ordersitems";
    protected $fillable = [
        'oder_id',
        'product_id',
        'quantite',
        'prix_unitaire'
    ];

    /**
     * La commande associée à cet article.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Le produit lié à cet article de commande.
     */
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'product_id');
    }
}