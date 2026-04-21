# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a book management application with a Laravel 13 backend API and React Native/Expo mobile frontend. The app supports two user roles: admins (who manage books) and customers (who browse books and place orders).

## Architecture

### Backend (book-api/)
- **Framework**: Laravel 13 with Sanctum for API authentication
- **Database**: SQLite (located at `book-api/database/database.sqlite`)
- **Authentication**: Laravel Sanctum with token-based auth
- **Models**: User, Book, Order, OrderItem
- **API Routes**: Defined in `routes/api.php`
- **Controllers**: Located in `app/Http/Controllers/Api/`

### Frontend (mobile/)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (native stack)
- **State Management**: React Context API (auth-context, cart-context)
- **Persistence**: AsyncStorage for tokens and user data
- **API Client**: Axios
- **Screens**: Welcome, Login, Signup, AdminBooks, CustomerBooks, Cart

## Common Commands

### Backend Development
```bash
cd book-api

# Start development server
php artisan serve

# Run database migrations
php artisan migrate

# Run tests
composer test

# Install dependencies
composer install
```

### Frontend Development
```bash
cd mobile

# Start Expo development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Install dependencies
npm install
```

## Key Architecture Patterns

### Authentication Flow
1. Users register/login via API endpoints (`/register`, `/login`)
2. Backend returns Sanctum token
3. Frontend stores token in AsyncStorage
4. Token included in axios Authorization header for protected routes
5. Admin role determined by `user.role === 'admin'`

### API Route Structure
- **Public**: `/books` (GET), `/books/{id}` (GET)
- **Auth Required**: `/logout` (POST), `/orders` (POST)
- **Admin Only**: `/books` (POST, PUT, DELETE)

### State Management
- **AuthContext**: Manages authentication state, token, and user info
- **CartContext**: Manages shopping cart state
- **Custom Hooks**: `useBooks` (book data fetching), `useBookForm` (form handling)

### Database Schema
- **Users**: name, email, password, role (admin/customer)
- **Books**: title, author, description, price, stock, cover_image
- **Orders**: user_id, total, status
- **OrderItems**: order_id, book_id, quantity, price

## Development Notes

- The backend uses SQLite for development - ensure `database/database.sqlite` exists
- API base URL is configured in mobile app (check axios instance setup)
- Admin users have `role` field set to 'admin' in users table
- Cart functionality is client-side only (not persisted to backend)
- Book images are stored as URLs/paths in the database
