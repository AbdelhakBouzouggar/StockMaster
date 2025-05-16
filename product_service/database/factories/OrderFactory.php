<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
            'total' => null,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            $orderItems = OrderItem::factory()
                ->count($this->faker->numberBetween(1, 5))
                ->create([
                    'oder_id' => $order->id,
                ]);

            $total = $orderItems->sum(fn($item) => $item->prix_unitaire * $item->quantite);

            $order->update(['total' => $total]);
        });
    }
}
