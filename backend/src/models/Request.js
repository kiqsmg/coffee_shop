import mongoose from 'mongoose';

// Chamado ("peca agora"): cliente sinaliza que quer um produto e o admin atende.
// Guarda snapshot do nome do cliente e do produto para a lista do admin
// continuar legivel mesmo que o usuario/produto mude depois.
const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'atendido'], default: 'pendente' },
  },
  { timestamps: true }
);

export default mongoose.model('Request', requestSchema);
