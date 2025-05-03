<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'produit_id',
        'type_mouvement',
        'quantite',
        'utilisateur_id',
        'date_mouvement',
        'commentaire',
    ];
//
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}