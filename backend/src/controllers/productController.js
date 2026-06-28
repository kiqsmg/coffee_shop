import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { code, name } = req.body;
    const exists = await Product.findOne({ $or: [{ code }, { name }] });
    if (exists) {
      return res.status(400).json({ message: 'Código ou nome já cadastrado' });
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { code, name } = req.body;
    if (code || name) {
      const duplicate = await Product.findOne({
        _id: { $ne: req.params.id },
        $or: [...(code ? [{ code }] : []), ...(name ? [{ name }] : [])],
      });
      if (duplicate) {
        return res.status(400).json({ message: 'Código ou nome já cadastrado' });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto removido' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
