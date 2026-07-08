const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load JSON datasets synchronously
const categories = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/categories.json'), 'utf-8')
);
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8')
);

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    // 1. Establish connection to MongoDB
    await connectDB();
    console.log('Database connection established.');

    // 2. Clear existing collections to start with a clean slate
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Cleared existing product and category collections.');

    // 3. Seed Categories and capture slug -> ObjectId mappings
    const createdCategories = await Category.insertMany(categories);
    console.log(`Successfully seeded ${createdCategories.length} categories.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 4. Map string category slugs in products to their database ObjectIds and generate slugs
    const slugify = require('slugify');
    const preparedProducts = products.map((prod) => {
      const categoryId = categoryMap[prod.category];
      if (!categoryId) {
        throw new Error(
          `Validation Error: Category slug "${prod.category}" specified in product "${prod.title}" does not exist in categories dataset.`
        );
      }
      return {
        ...prod,
        category: categoryId,
        slug: slugify(prod.title, { lower: true, strict: true })
      };
    });

    // 5. Seed Products
    const createdProducts = await Product.insertMany(preparedProducts);
    console.log(`Successfully seeded ${createdProducts.length} products.`);

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Check if script is run directly from command line
if (require.main === module) {
  seedDatabase();
}
