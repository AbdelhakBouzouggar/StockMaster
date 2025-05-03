<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockMovementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'type_mouvement' => 'required|in:entrée,sortie,ajustement,transfert',
            'quantite' => 'required|integer',
            'commentaire' => 'nullable|string',
        ]);

        StockMovement::create([
            'produit_id' => $request->produit_id,
            'type_mouvement' => $request->type_mouvement,
            'quantite' => $request->quantite,
            'utilisateur_id' => Auth::id(),
            'date_mouvement' => now(),
            'commentaire' => $request->commentaire,
        ]);

        return response()->json(['message' => 'Mouvement enregistré avec succès.'], 201);
    }

    public function index()
    {
        return StockMovement::with(['produit', 'utilisateur'])->latest()->get();
    }
}//