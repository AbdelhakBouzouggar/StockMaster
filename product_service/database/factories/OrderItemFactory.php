<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'oder_id' => Order::factory(),
            'product_id' => Produit::factory(),
            'quantite' => $this->faker->numberBetween(1, 5),
            'prix_unitaire' => $this->faker->numberBetween(10, 500),
        ];
    }
}
