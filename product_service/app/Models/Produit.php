<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    use HasFactory;
    protected $table ="products";
    protected $fillable = [
        'name', 'description', 'price', 'quantite', 'image', 'status', 'categorie_id'
    ];
//
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }
}
