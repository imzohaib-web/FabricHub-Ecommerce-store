# Fabric Hub Database Schema Design (MongoDB)

This document details the MongoDB database schema design for the **Fabric Hub** e-commerce store. 

All tables are designed to support MongoDB best practices and direct integration with Mongoose in Node.js.

---

## 1. Users Collection (`users`)

### Purpose
Manages customer profiles, credentials, and access roles (standard customers vs admins).

### Schema Definition
| Field Name | Data Type | Required | Default Value | References / Enum | Index / Unique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes | Auto-generated | - | Primary Key |
| `name` | `String` | Yes | - | - | - |
| `email` | `String` | Yes | - | - | Unique Index |
| `password` | `String` | Yes | - | - | - |
| `role` | `String` | Yes | `"user"` | `["user", "admin"]` | Index |
| `createdAt`| `Date` | Yes | Current Date | - | - |
| `updatedAt`| `Date` | Yes | Current Date | - | - |

### Database Indexes
*   **Unique Index**: `{ email: 1 }` (Enforces login credentials uniqueness and speeds up authentication queries).
*   **Single Field Index**: `{ role: 1 }` (Speeds up administrative queries and route authorization checks).

### Validation Rules
*   **`name`**: Trimmed, minimum length: 2 chars, maximum length: 50 chars.
*   **`email`**: Trimmed, lowercase, and must match standard email validation regex: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`.
*   **`password`**: Minimum length: 8 chars. (Must be stored as a hashed string using `bcryptjs` with salt round 12. Marked as `select: false` to prevent accidental inclusion in API responses).
*   **`role`**: Strictly restricted to values in the enum `["user", "admin"]`.

---

## 2. Categories Collection (`categories`)

### Purpose
Stores product categories (e.g., Lawn Collection, Unstitched, Shawls) for navigation, catalog layout, and filtering.

### Schema Definition
| Field Name | Data Type | Required | Default Value | References / Enum | Index / Unique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes | Auto-generated | - | Primary Key |
| `name` | `String` | Yes | - | - | Unique Index |
| `slug` | `String` | Yes | - | - | Unique Index |
| `image` | `String` | Yes | - | - | - |
| `description`| `String` | No | - | - | - |
| `createdAt` | `Date` | Yes | Current Date | - | - |
| `updatedAt` | `Date` | Yes | Current Date | - | - |

### Database Indexes
*   **Unique Index**: `{ name: 1 }` (Prevents duplicate categories).
*   **Unique Index**: `{ slug: 1 }` (Ensures SEO-friendly routes like `/category/lawn-collection` are clean and uniquely identified).

### Validation Rules
*   **`name`**: Trimmed, minimum length: 2 chars, maximum length: 50 chars.
*   **`slug`**: Trimmed, lowercase, URL-friendly format. Must match regex: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
*   **`image`**: Must be a non-empty string representing a relative file path (e.g., `/uploads/categories/lawn.webp`) or a valid absolute HTTP URL.
*   **`description`**: Maximum length: 500 chars.

---

## 3. Products Collection (`products`)

### Purpose
Represents the fabric inventory catalog, custom options (colors, sizes), stock state, and averages calculated from reviews.

### Schema Definition
| Field Name | Data Type | Required | Default Value | References / Enum | Index / Unique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes | Auto-generated | - | Primary Key |
| `name` | `String` | Yes | - | - | - |
| `slug` | `String` | Yes | - | - | Unique Index |
| `price` | `Number` | Yes | - | - | Index |
| `category` | `ObjectId` | Yes | - | Refers to `categories` | Index |
| `image` | `String` | Yes | - | - | - |
| `images` | `[String]` | No | `[]` | - | - |
| `description`| `String` | Yes | - | - | - |
| `rating` | `Number` | Yes | `0` | - | - |
| `reviewsCount`|`Number` | Yes | `0` | - | - |
| `stock` | `Number` | Yes | `0` | - | - |
| `inStock` | `Boolean` | Yes | `true` | - | Index |
| `sizes` | `[String]` | Yes | `[]` | Enum check per item | - |
| `colors` | `[Object]` | No | `[]` | Array of subdocuments | - |
| `isFeatured` | `Boolean` | Yes | `false` | - | Index |
| `isBestSeller`|`Boolean` | Yes | `false` | - | Index |
| `details` | `[String]` | No | `[]` | - | - |
| `createdAt` | `Date` | Yes | Current Date | - | - |
| `updatedAt` | `Date` | Yes | Current Date | - | - |

#### Colors Subdocument Schema
```javascript
{
  name: { type: String, required: true },  // e.g., "Ivory"
  value: { type: String, required: true }  // e.g., "#FFFFF0" (Hex Color)
}
```

### Database Indexes
*   **Unique Index**: `{ slug: 1 }` (Speeds up product detail views by URL parameters like `/product/ethereal-ivory-lawn-suit`).
*   **Single Field Index**: `{ category: 1 }` (Speeds up category-specific filtering).
*   **Compound Index**: `{ category: 1, price: 1 }` (Speeds up combined filters like finding lawn suits sorted by price ascending).
*   **Compound Index**: `{ isFeatured: 1, isBestSeller: 1 }` (Speeds up landing page feature listings).
*   **Text Index**: `{ name: "text", description: "text" }` (Allows quick full-text search capability for the search bar).

### Validation Rules
*   **`price`**: Must be a positive number (`>= 0`).
*   **`stock`**: Non-negative integer (`>= 0`). (If `stock` drops to 0, application logic must update `inStock` to `false`).
*   **`rating`**: Floating-point number between `0` and `5` (inclusive).
*   **`reviewsCount`**: Non-negative integer.
*   **`sizes`**: Individual elements restricted to enum values: `["XS", "S", "M", "L", "XL", "OS"]`.
*   **`colors.value`**: Hex values must match regex: `/^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$/`.
*   **`details`**: Array of detail specification strings (e.g. `["Shirt: 3m Self-Jacquard Lawn", "Dry clean only"]`).

---

## 4. Orders Collection (`orders`)

### Purpose
Stores transactional purchase records, shipping addresses, customer snapshot info, and delivery tracking status.

### Schema Definition
| Field Name | Data Type | Required | Default Value | References / Enum | Index / Unique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes | Auto-generated | - | Primary Key |
| `orderId` | `String` | Yes | - | - | Unique Index |
| `user` | `ObjectId` | Yes | - | Refers to `users` | Index |
| `customerName`|`String` | Yes | - | - | - |
| `customerEmail`|`String` | Yes | - | - | - |
| `shippingDetails`|`Object` | Yes | - | Sub-schema | - |
| `items` | `[Object]` | Yes | - | Array of sub-schema items| - |
| `totalAmount`| `Number` | Yes | - | - | - |
| `status` | `String` | Yes | `"Pending"` | Enum check | Index |
| `createdAt` | `Date` | Yes | Current Date | - | - |
| `updatedAt` | `Date` | Yes | Current Date | - | - |

#### ShippingDetails Sub-Schema
```javascript
{
  address: { type: String, required: true },
  city: { type: String, required: true },
  postal: { type: String, required: true }
}
```

#### Items Subdocument Schema (Invoice Snapshot)
```javascript
{
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Snapshotted price at order placement time
  size: { type: String, required: true },
  color: { type: String }
}
```

### Database Indexes
*   **Unique Index**: `{ orderId: 1 }` (Prevents order number collision).
*   **Single Field Index**: `{ user: 1 }` (Speeds up loading user purchase histories).
*   **Single Field Index**: `{ status: 1 }` (Optimizes admin workflows for tracking pending/processing orders).

### Validation Rules
*   **`orderId`**: Custom ID format (e.g. `FH` + 6 random digits). Must match regex: `/^FH\d{6}$/`.
*   **`items`**: Minimum array size: 1. `price` must be snapshot historical value (`>= 0`) to prevent database price shifts from changing historical invoices.
*   **`totalAmount`**: Must equal sum of product line items (`price * quantity`). Must be a non-negative number.
*   **`status`**: Enforced enum values: `["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]`.
*   **Inventory Rules**: Placing an order triggers a transaction that verifies and decrements corresponding product `stock` values.

---

## 5. Reviews Collection (`reviews`)

### Purpose
Houses individual user ratings and text feedback left on products.

### Schema Definition
| Field Name | Data Type | Required | Default Value | References / Enum | Index / Unique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes | Auto-generated | - | Primary Key |
| `user` | `ObjectId` | Yes | - | Refers to `users` | Compound Index |
| `product` | `ObjectId` | Yes | - | Refers to `products` | Compound Index |
| `rating` | `Number` | Yes | - | - | - |
| `comment` | `String` | Yes | - | - | - |
| `createdAt` | `Date` | Yes | Current Date | - | - |
| `updatedAt` | `Date` | Yes | Current Date | - | - |

### Database Indexes
*   **Compound Unique Index**: `{ user: 1, product: 1 }` (Enforces business logic: **one review per product per user**).
*   **Single Field Index**: `{ product: 1 }` (Speeds up listing reviews on product details tab).

### Validation Rules
*   **`rating`**: Integer constraint from `1` to `5` (inclusive).
*   **`comment`**: Trimmed, min length: 3 chars, max length: 1000 chars.
*   **Hook Recalculation**: Post-save and Post-delete hooks trigger on this collection to query all reviews for the matching `product` ID, calculate the mathematical average rating, count the results, and update the associated `Product` document with the new `rating` and `reviewsCount` aggregates.

---

## 6. Wishlists Collection (`wishlists`)

### Purpose
Persists favorite fabric listings for customers, replacing browser-specific client-side localStorage.

### Schema Definition
| Field Name | Data Type | Required | Default Value | References / Enum | Index / Unique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes | Auto-generated | - | Primary Key |
| `user` | `ObjectId` | Yes | - | Refers to `users` | Unique Index |
| `products` | `[ObjectId]` | Yes | `[]` | Refers to `products` | - |
| `updatedAt` | `Date` | Yes | Current Date | - | - |

### Database Indexes
*   **Unique Index**: `{ user: 1 }` (Enforces one unique wishlist per customer account for high performance retrieval).

### Validation Rules
*   **`products`**: Array of ObjectIds. Application-level endpoints will ensure only unique product IDs are saved in the array (preventing duplicates).

---

## User Review Required

> [!IMPORTANT]
> 1. **Compound Index for Reviews**: We have restricted users to one review per product via `{ user: 1, product: 1 }` unique constraint. Please confirm if users should be allowed to submit multiple reviews per product instead.
> 2. **Historical Pricing Snapshot**: The `Order.items` array duplicates the `price` field as a number at order execution. This is a critical pattern in e-commerce database design to prevent historical invoice values from shifting when a product's price is updated in the catalog.
