/**
 * Seed script — populates the database with the initial menu products
 * and an admin user (if they don't exist yet).
 *
 * Usage:
 *   node src/seed.js
 *   node src/seed.js --wipe   (drops existing products/users first)
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in .env');
  process.exit(1);
}

// ─── Inline mini-schemas (avoids circular imports with the full app) ──────────

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
});

const productSchema = new mongoose.Schema({
  code: { type: String, unique: true, uppercase: true, trim: true },
  name: { type: String, unique: true, trim: true },
  ingredients: [String],
  imageUrl: { type: String, default: '' },
  category: { type: String, default: 'Bebida' },
  price: Number,
  available: { type: Boolean, default: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ─── Data ─────────────────────────────────────────────────────────────────────

const ADMIN = {
  name: 'Admin',
  email: 'admin@estaçaocafe.com',
  password: 'Admin@123',
  role: 'admin',
};

const PRODUCTS = [
  {
    code: 'CAP01',
    name: 'Cappuccino',
    ingredients: ['Café espresso', 'Leite vaporizado', 'Espuma de leite', 'Cacau em pó'],
    imageUrl: '/img/menu-1.jpeg',
    category: 'Bebida Quente',
    price: 12,
  },
  {
    code: 'ESP01',
    name: 'Expresso',
    ingredients: ['Café espresso', 'Água'],
    imageUrl: '/img/menu-2.jpeg',
    category: 'Bebida Quente',
    price: 8,
  },
  {
    code: 'MAT01',
    name: 'Matcha Latte',
    ingredients: ['Chá matcha', 'Leite vaporizado', 'Mel'],
    imageUrl: '/img/menu-3.jpeg',
    category: 'Bebida Quente',
    price: 20,
  },
  {
    code: 'FRA01',
    name: 'Frappuccino',
    ingredients: ['Café espresso', 'Leite', 'Gelo', 'Calda de caramelo', 'Chantilly'],
    imageUrl: '/img/menu-4.jpeg',
    category: 'Bebida Gelada',
    price: 20,
  },
  {
    code: 'MAC01',
    name: 'Macchiato',
    ingredients: ['Café espresso', 'Leve espuma de leite'],
    imageUrl: '/img/menu-5.jpeg',
    category: 'Bebida Quente',
    price: 18,
  },
  {
    code: 'SOD01',
    name: 'Soda Italiana',
    ingredients: ['Água com gás', 'Xarope de frutas', 'Limão', 'Gelo'],
    imageUrl: '/img/menu-6.jpeg',
    category: 'Bebida Gelada',
    price: 14,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const wipe = process.argv.includes('--wipe');

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  if (wipe) {
    await Product.deleteMany({});
    await User.deleteMany({ role: 'admin' });
    console.log('Existing products and admin users cleared.');
  }

  // ── Products ──
  let inserted = 0;
  let skipped = 0;

  for (const data of PRODUCTS) {
    const exists = await Product.findOne({ code: data.code });
    if (exists) {
      console.log(`  SKIP  ${data.name} (already exists)`);
      skipped++;
    } else {
      await Product.create(data);
      console.log(`  OK    ${data.name}`);
      inserted++;
    }
  }

  console.log(`\nProducts: ${inserted} inserted, ${skipped} skipped.`);

  // ── Admin user ──
  const existingAdmin = await User.findOne({ email: ADMIN.email });
  if (existingAdmin) {
    console.log(`Admin user already exists (${ADMIN.email}).`);
  } else {
    const hashed = await bcrypt.hash(ADMIN.password, 10);
    await User.create({ ...ADMIN, password: hashed });
    console.log(`\nAdmin user created:`);
    console.log(`  Email:    ${ADMIN.email}`);
    console.log(`  Password: ${ADMIN.password}`);
    console.log('  ⚠️  Change this password after first login!');
  }

  await mongoose.disconnect();
  console.log('\nDone. Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
