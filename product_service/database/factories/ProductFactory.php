<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(10, 1000),
            'quantite' => $this->faker->numberBetween(1, 100),
            'image' => $this->faker->imageUrl(),
            'categorie_id' => Category::factory()
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Product $product) {
            //
        })->afterCreating(function (Product $product) {
            if ($product->quantite == 0) {
                $product->status = 'Out of Stock';
            } elseif ($product->quantite < 10) {
                $product->status = 'Low Stock';
            } else {
                $product->status = 'In Stock';
            }

            $product->saveQuietly();
        });
    }
}
