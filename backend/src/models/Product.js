import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, unique: true, trim: true },
    ingredients: [{ type: String, trim: true }],
    imageUrl: { type: String, default: '' },
    category: { type: String, trim: true, default: 'Bebida' },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
