# Database Seeder & Data Migration Guide

This guide explains how to migrate your existing frontend mock data (from `products.js` and `categories.js`) into your MongoDB Atlas or local database instance.

## Seeder Structure

The seeder files are located in the `Backend/seeders/` directory:
- `seed.js`: The node script that connects to MongoDB, cleans collections, and imports the JSON data.
- `data/categories.json`: Seeding template containing all categories.
- `data/products.json`: Seeding template containing all products.

---

## Migration Steps: Copying Dummy Data to JSON

Because frontend files (`products.js` / `categories.js`) use **ES6 Modules** and **Vite Asset Imports** (e.g., `import ready1 from '../assets/images/Ready to wear.webp'`), they cannot be executed directly by Node.js. 

Follow these steps to copy your products into `products.json`:

### 1. Map React ES Imports to Path Strings
When copying product items, replace Vite import variables with local server public URL paths:
*   **Frontend Reference:** `image: ready1` (where `ready1` is imported from `../assets/images/Ready to wear.webp`)
*   **JSON Target:** `"images": ["/uploads/products/ready-to-wear.webp"]` (use standard relative strings).
*   *Note: In the backend, we store all product images under the `"images"` array. Your main image will simply be the first element in the array.*

### 2. Rename Frontend Properties to Backend Schema Fields
Some frontend properties need to be renamed to match our Mongoose schema definition:
*   **Rename `name` to `title`**:
    *   *Frontend:* `name: "Ethereal Ivory Lawn Suit"`
    *   *JSON:* `"title": "Ethereal Ivory Lawn Suit"`
*   **Rename `isFeatured` to `featured`**:
    *   *Frontend:* `isFeatured: true`
    *   *JSON:* `"featured": true`
*   **Ensure `category` value matches Category Slugs**:
    *   The `category` field in `products.json` should be the lowercase string slug of the category (e.g., `"lawn-collection"`, `"ready-to-wear"`). The seed script will automatically query the Category database, fetch the correct MongoDB `ObjectId`, and assign it to the product.

### 3. JSON Field Format Example

Here is how a single product should be structured in `products.json`:
```json
{
  "title": "Midnight Velvet Kaftan",
  "price": 14500,
  "category": "formal",
  "images": [
    "/uploads/products/formal.avif",
    "/uploads/products/wedding-wear.avif"
  ],
  "description": "An absolute showstopper. Woven from luxurious silk micro-velvet...",
  "rating": 4.9,
  "reviewsCount": 14,
  "stock": 8,
  "sizes": ["S", "M", "L"],
  "colors": [
    { "name": "Obsidian Black", "value": "#0B0B0C" },
    { "name": "Midnight Navy", "value": "#191970" }
  ],
  "featured": true
}
```

---

## How to Import Products (Execution)

Once you have added all your products and categories into `data/products.json` and `data/categories.json`:

1.  Open your terminal and navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Run the seed script using node:
    ```bash
    node seeders/seed.js
    ```
3.  The console will output the migration progress:
    ```
    Database connection established.
    Cleared existing product and category collections.
    Successfully seeded 12 categories.
    Successfully seeded 4 products.
    Database seeding process completed successfully!
    ```
