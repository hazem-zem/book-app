<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // Public - list books
    public function index(Request $request)
    {
    $query = Book::query();

    // Search (title or author)
    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%$search%")
              ->orWhere('author', 'like', "%$search%");
        });
    }

    // Price filter
    if ($request->filled('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }

    if ($request->filled('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }
    // Sort by price
    if ($request->filled('sort')) {
        $query->orderBy('price', $request->sort); // asc / desc
    }

    // Pagination (10 per page)
    return $query->latest()->paginate(10);
    }

    // Public - single book
    public function show($id)
    {
        return Book::findOrFail($id);
    }

    // Admin only
    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'title' => 'required',
            'author' => 'required',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        return Book::create($data);
    }

    // Admin only
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $book = Book::findOrFail($id);

        $book->update($request->all());

        return $book;
    }

    // Admin only
    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        Book::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function authorizeAdmin($request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Admins only');
        }
    }
}