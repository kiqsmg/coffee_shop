import Comment from '../models/Comment.js';
import Product from '../models/Product.js';

export const getCommentsByProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const comments = await Comment.find({ product: req.params.productId })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'O comentário não pode estar vazio' });
    }
    if (text.trim().length > 500) {
      return res.status(400).json({ message: 'Comentário não pode ter mais de 500 caracteres' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const comment = await Comment.create({
      product: req.params.productId,
      user: req.user._id,
      userName: req.user.name,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    const isOwner = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Sem permissão para apagar este comentário' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comentário removido' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
