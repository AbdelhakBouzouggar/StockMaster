<?php
namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index()
    {
        return Produit::with('category')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantite' => 'required|integer',
            'image' => 'nullable|image',
            'categorie_id' => 'required|exists:categories,id'
        ]);
//
        $product = Produit::create($validated);

        if ($product->quantite == 0) {
            $product->status = 'Out of Stock';
        } elseif ($product->quantite < 10) {
            $product->status = 'Low Stock';
        } else {
            $product->status = 'In Stock';
        }

        $product->saveQuietly();

        return $product;
    }

    public function show(Produit $produit)
    {
        return $produit->load('category');
    }

    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'quantite' => 'sometimes|integer',
            'image' => 'nullable|string',
            'categorie_id' => 'sometimes|exists:categories,id'
        ]);

        $produit->update($validated);

        if ($produit->quantite == 0) {
            $produit->status = 'Out of Stock';
        } elseif ($produit->quantite < 10) {
            $produit->status = 'Low Stock';
        } else {
            $produit->status = 'In Stock';
        }

        $produit->saveQuietly();

        return $produit;
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }
    }
