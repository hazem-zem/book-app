<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Book;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.book_id' => 'required|exists:books,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {

            $total = 0;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => 0,
            ]);

            foreach ($request->items as $item) {
                $book = Book::findOrFail($item['book_id']);

                if ($book->stock < $item['quantity']) {
                    abort(400, "Not enough stock for {$book->title}");
                }

                $price = $book->price;
                $subtotal = $price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'book_id' => $book->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ]);

                $book->decrement('stock', $item['quantity']);

                $total += $subtotal;
            }

            $order->update([
                'total_price' => $total
            ]);

            return $order->load('items.book');
        });
    }
}