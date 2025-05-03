<?php


namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'oder_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantite' => 'required|integer|min:1',
            'prix_unitaire' => 'required|numeric|min:0',
        ]);

        return OrderItem::create($validated);
    }

    public function update(Request $request, OrderItem $orderItem)
    {
        $validated = $request->validate([
            'quantite' => 'sometimes|integer|min:1',
            'prix_unitaire' => 'sometimes|numeric|min:0',
        ]);

        $orderItem->update($validated);

        return $orderItem;
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();

        return response()->json(['message' => 'Élément supprimé.']);
    }
    //
}