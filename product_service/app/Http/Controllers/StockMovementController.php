<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

class StockMovementController extends Controller
{
   public function store(Request $request)
{
    $request->validate([
        'produit_id' => 'required|exists:products,id',
        'type_mouvement' => 'required|in:entrée,sortie,ajustement,transfert',
        'quantite' => 'required|integer|min:1',
        'commentaire' => 'nullable|string',
    ]);

    $produit = Produit::findOrFail($request->produit_id);

    switch ($request->type_mouvement) {
        case 'entrée':
            $produit->quantite += $request->quantite;
            break;

        case 'sortie':
            if ($produit->quantite < $request->quantite) {
                return response()->json(['message' => 'Stock insuffisant.'], 400);
            }
            $produit->quantite -= $request->quantite;
            break;

        case 'ajustement':
            $produit->quantite = $request->quantite;
            break;

        default:
            return response()->json(['message' => 'Type de mouvement non pris en charge.'], 400);
    }
    $produit->save();
        StockMovement::create([
            'produit_id' => $request->produit_id,
            'type_mouvement' => $request->type_mouvement,
            'quantite' => $request->quantite,
            'utilisateur_id' => $request->utilisateur_id,
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