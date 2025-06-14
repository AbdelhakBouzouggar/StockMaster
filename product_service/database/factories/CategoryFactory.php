<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $categoryNames = [
            'Electronics',
            'Clothing',
            'Home & Garden',
            'Books',
            'Sports',
            'Toys & Games',
            'Beauty',
            'Health',
            'Automotive',
            'Grocery'
        ];
        return [
            'nom' => $this->faker->randomElement($categoryNames),
            'description' => $this->faker->sentence(),
        ];
    }
}
