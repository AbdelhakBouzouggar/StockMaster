<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\RabbitMQService;

class ProduitController extends Controller
{
    public function index()
    {
        return Product::with('category')->get();
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

        $product = Product::create($validated);

        // Set status based on stock level
        if ($product->quantite == 0) {
            $product->status = 'Out of Stock';
        } elseif ($product->quantite < 10) {
            $product->status = 'Low Stock';
        } else {
            $product->status = 'In Stock';
        }

        $product->saveQuietly();

        // Publish to RabbitMQ if stock is low
        if (in_array($product->status, ['Low Stock', 'Out of Stock'])) {
            $rabbit = new RabbitMQService();
            $rabbit->publish('notifications', [
                'event' => 'stock.low',
                'product_id' => $product->id,
                'quantite' => $product->quantite,
                'status' => $product->status,
                'timestamp' => now()
            ]);
        }

        return $product;
    }

    public function show(Product $produit)
    {
        return $produit->load('category');
    }

    public function update(Request $request, Product $produit)
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

        // Set status based on updated quantity
        if ($produit->quantite == 0) {
            $produit->status = 'Out of Stock';
        } elseif ($produit->quantite < 10) {
            $produit->status = 'Low Stock';
        } else {
            $produit->status = 'In Stock';
        }

        $produit->saveQuietly();

        if (in_array($produit->status, ['Low Stock', 'Out of Stock'])) {
            $rabbit = new RabbitMQService();
            $rabbit->publish('notifications', [
                'event' => 'stock.low',
                'product_id' => $produit->id,
                'quantite' => $produit->quantite,
                'status' => $produit->status,
                'timestamp' => now()
            ]);
        }

        return $produit;
    }

    public function destroy(Product $produit)
    {
        $produit->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }
}