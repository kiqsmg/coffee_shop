import User from '../models/User.js';

// GET /api/users/:id - perfil do usuario (sem a senha)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id - atualiza o proprio cadastro
export const updateUser = async (req, res) => {
  try {
    // so o proprio usuario pode editar o proprio cadastro
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Você só pode editar o próprio cadastro' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // atualiza apenas os campos enviados; usa save() para o pre('save') re-hashear a senha
    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
