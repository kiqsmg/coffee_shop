import Request from '../models/Request.js';
import Product from '../models/Product.js';

// POST /api/requests - cliente sinaliza que quer um produto (chamar atendente)
export const createRequest = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const request = await Request.create({
      user: req.user._id,
      userName: req.user.name,
      product: product._id,
      productName: product.name,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests - admin lista os chamados (pendentes primeiro)
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ status: 1, createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/requests/:id - admin marca o chamado como atendido
export const attendRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: 'atendido' },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Chamado não encontrado' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
