import Request from '../models/Request.js';
import Product from '../models/Product.js';

// POST /api/requests - cliente sinaliza que quer um produto (chamar atendente)
export const createRequest = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Idempotente: se ja existe um chamado pendente deste usuario pro mesmo
    // produto, devolve o existente em vez de duplicar (cliente que sai e volta
    // ao menu nao gera N chamados iguais na lista do atendente).
    // ponytail: findOne+create tem janela de corrida em cliques simultaneos;
    // se virar problema, trocar por indice unico parcial {user,product,status:'pendente'}.
    const existing = await Request.findOne({
      user: req.user._id,
      product: product._id,
      status: 'pendente',
    });
    if (existing) {
      return res.status(200).json(existing);
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

// GET /api/requests/mine - cliente ve os proprios chamados pendentes
// (usado pelo menu pra manter o botao "Atendente a caminho" apos navegar)
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      user: req.user._id,
      status: 'pendente',
    });
    res.json(requests);
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
