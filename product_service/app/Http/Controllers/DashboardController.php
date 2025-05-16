<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();

        $totalOrders = Order::count();

        $lowStockItems = Product::where('quantite', '<', 10)->count();

        $currentMonthRevenue = Order::whereMonth('created_at', now()->month)
            ->sum('total');

        $lastMonthRevenue = Order::whereMonth('created_at', now()->subMonth()->month)
            ->sum('total');

        $revenueChange = $lastMonthRevenue === 0
            ? ($currentMonthRevenue > 0 ? 100 : 0)
            : (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;

        $monthlySales = Order::select(
                DB::raw("MONTH(created_at) as month"),
                DB::raw("SUM(total) as total_sales")
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month)),
                    'sales' => $item->total_sales,
                    'purchases' => rand(1000, 5000)
                ];
            });

        $categoryDistribution = Product::with('category')
            ->select(
                DB::raw("COALESCE(categories.nom, 'Uncategorized') as category_name"),
                DB::raw('COUNT(*) as count')
            )
            ->leftJoin('categories', 'products.categorie_id', '=', 'categories.id')
            ->groupBy('category_name')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category_name,
                    'count' => $item->count
                ];
            });

        $weeklyTrend = Order::select(
                DB::raw("DATE(created_at) as date"),
                DB::raw("SUM(total) as total_sales")
            )
            ->whereDate('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'sales' => $item->total_sales
                ];
            });

        $recentActivity = collect();

        $latestProducts = Product::latest()->take(2)->get();
        foreach ($latestProducts as $product) {
            $recentActivity->push([
                'id' => $product->id,
                'activity' => "New product added: {$product->name}",
                'time' => $product->created_at->diffForHumans(),
                'type' => 'add'
            ]);
        }

        $lowStockProducts = Product::where('quantite', '<', 5)->take(2)->get();
        foreach ($lowStockProducts as $product) {
            $recentActivity->push([
                'id' => $product->id + 100,
                'activity' => "Low stock alert: {$product->name} ({$product->quantite} left)",
                'time' => now()->diffForHumans(),
                'type' => 'alert'
            ]);
        }

        $latestOrders = Order::with('user')->latest()->take(2)->get();
        foreach ($latestOrders as $order) {
            $recentActivity->push([
                'id' => $order->id,
                'activity' => "Order #{$order->id} received by " . ($order->user ? $order->user->name : 'Guest'),
                'time' => $order->created_at->diffForHumans(),
                'type' => 'order'
            ]);
        }

        return response()->json([
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'lowStockItems' => $lowStockItems,
                'revenueChange' => round($revenueChange, 1),
            ],
            'monthlyData' => [
                'labels' => $monthlySales->pluck('month'),
                'datasets' => [
                    [
                        'label' => 'Sales',
                        'data' => $monthlySales->pluck('sales'),
                        'backgroundColor' => 'rgba(59, 130, 246, 0.6)',
                    ],
                    [
                        'label' => 'Purchases',
                        'data' => $monthlySales->pluck('purchases'),
                        'backgroundColor' => 'rgba(16, 185, 129, 0.6)',
                    ]
                ]
            ],
            'productCategoryData' => [
                'labels' => $categoryDistribution->pluck('category'),
                'datasets' => [
                    [
                        'label' => 'Products',
                        'data' => $categoryDistribution->pluck('count'),
                        'backgroundColor' => [
                            'rgba(59, 130, 246, 0.6)',
                            'rgba(16, 185, 129, 0.6)',
                            'rgba(245, 158, 11, 0.6)',
                            'rgba(244, 63, 94, 0.6)',
                            'rgba(139, 92, 246, 0.6)'
                        ]
                    ]
                ]
            ],
            'trendData' => [
                'labels' => $weeklyTrend->pluck('date'),
                'datasets' => [
                    [
                        'label' => 'Weekly Trend',
                        'data' => $weeklyTrend->pluck('sales'),
                        'borderColor' => 'rgba(59, 130, 246, 0.8)',
                        'backgroundColor' => 'rgba(59, 130, 246, 0.2)',
                        'tension' => 0.4,
                        'fill' => true
                    ]
                ]
            ],
            'recentActivity' => $recentActivity->values()
        ]);
    }
}
