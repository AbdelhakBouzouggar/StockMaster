<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['user', 'orderItems.product'])->get();
    }

    // Récupérer une commande spécifique avec les détails
    public function show(Order $order)
    {
        return $order->load(['user', 'orderItems.product']);
    }

    public function store(Request $request)
    {
        // Validation des données
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'ordersitems' => 'required|array|min:1',
            'ordersitems.*.product_id' => 'required|exists:products,id',
            'ordersitems.*.quantite' => 'required|integer|min:1',
            'ordersitems.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        // Calcul du total
        $total = 0;
        foreach ($validated['ordersitems'] as $item) {
            $total += $item['quantite'] * $item['prix_unitaire'];
        }

        // Création de la commande
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'status' => 'pending',
            'total' => $total,
        ]);

        // Création des articles de commande
        foreach ($validated['ordersitems'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantite' => $item['quantite'],
                'prix_unitaire' => $item['prix_unitaire'],
            ]);
        }

        return response()->json($order->load(['user', 'orderItems.product']), 201);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Processing,Shipped,Delivered,Cancelled'
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json($order->load(['user', 'orderItems.product']));
    }
}
