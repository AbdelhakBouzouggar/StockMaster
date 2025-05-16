<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

class StockMovementController extends Controller
{
<<<<<<< HEAD
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:products,id',
            'type_mouvement' => 'required|in:entrée,sortie,ajustement,transfert',
            'quantite' => 'required|integer',
            'commentaire' => 'nullable|string',
        ]);
=======
   public function store(Request $request)
{
    $request->validate([
        'produit_id' => 'required|exists:products,id',
        'type_mouvement' => 'required|in:entrée,sortie,ajustement,transfert',
        'quantite' => 'required|integer|min:1',
        'commentaire' => 'nullable|string',
    ]);
>>>>>>> origin/mona

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
        return StockMovement::with(['product', 'utilisateur'])->latest()->get();
    }
<<<<<<< HEAD
}
=======

    public function update(Request $request, $id)
{
    $request->validate([
        'produit_id' => 'required|exists:products,id',
        'type_mouvement' => 'required|in:entrée,sortie,ajustement',
        'quantite' => 'required|integer|min:1',
        'commentaire' => 'nullable|string',
    ]);

    $movement = StockMovement::findOrFail($id);
    $produit = Produit::findOrFail($movement->produit_id); 

    switch ($movement->type_mouvement) {
        case 'entrée':
            $produit->quantite -= $movement->quantite;
            break;
        case 'sortie':
            $produit->quantite += $movement->quantite;
            break;
        case 'ajustement':
            break;
    }

    if ($movement->produit_id != $request->produit_id) {
        $newProduit = Produit::findOrFail($request->produit_id);
    } else {
        $newProduit = $produit;
    }

    switch ($request->type_mouvement) {
        case 'entrée':
            $newProduit->quantite += $request->quantite;
            break;

        case 'sortie':
            if ($newProduit->quantite < $request->quantite) {
                return response()->json(['message' => 'Stock insuffisant pour cette mise à jour.'], 400);
            }
            $newProduit->quantite -= $request->quantite;
            break;

        case 'ajustement':
            $newProduit->quantite = $request->quantite;
            break;

        default:
            return response()->json(['message' => 'Type de mouvement non pris en charge.'], 400);
    }

    $produit->save();
    if ($newProduit->id !== $produit->id) {
        $newProduit->save();
    }

    $movement->update([
        'produit_id' => $request->produit_id,
        'type_mouvement' => $request->type_mouvement,
        'quantite' => $request->quantite,
        'commentaire' => $request->commentaire,
        'utilisateur_id' => $request->utilisateur_id ,
        'date_mouvement' => now(),
    ]);

    return response()->json(['message' => 'Mouvement mis à jour avec succès.']);
}

}
>>>>>>> origin/mona
