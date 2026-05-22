# Coffee Shop — Cafeteria Web App

Uma aplicação web full-stack no estilo Starbucks/The Coffee, desenvolvida com a stack **MERN** para a disciplina de Programação Web. O sistema permite que clientes visualizem o menu de bebidas e que funcionários (administradores) gerenciem os produtos por meio de um painel de controle.

---

## Funcionalidades

- Landing page com animação de café
- Visualização do menu com cards de produto (nome, código, ingredientes e foto)
- Cadastro e login de usuários com autenticação JWT
- Dois perfis de acesso:
  - **Administrador (funcionário):** pode criar, editar e excluir produtos
  - **Cliente:** pode apenas visualizar o menu
- Validação de duplicidade ao cadastrar produtos (código e nome únicos)
- Atualização de cadastro pelo próprio usuário
- Interface responsiva (desktop e mobile)
- Deploy contínuo disponível 24/7

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite, React Router, Tailwind CSS, Framer Motion |
| Backend | Node.js + Express |
| Banco de dados | MongoDB Atlas |
| Autenticação | JWT + bcrypt |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Estrutura do Projeto

```
coffee_shop/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   └── products.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── productController.js
│   │   └── middleware/
│   │       ├── auth.js
│   │       └── isAdmin.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Menu.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── AdminPanel.jsx
    │   │   └── Profile.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── services/
    │       └── api.js
    └── package.json
```

---

## Rotas da API

### Autenticação
| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastrar novo usuário | Público |
| POST | `/api/auth/login` | Login e geração de token | Público |

### Usuários
| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/users/:id` | Buscar perfil do usuário | Autenticado |
| PUT | `/api/users/:id` | Atualizar dados do usuário | Autenticado (próprio) |

### Produtos
| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/products` | Listar todos os produtos | Autenticado |
| GET | `/api/products/:id` | Buscar produto por ID | Autenticado |
| POST | `/api/products` | Criar novo produto | Admin |
| PUT | `/api/products/:id` | Editar produto | Admin |
| DELETE | `/api/products/:id` | Excluir produto | Admin |

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` com base no `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuita)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # preencha as variáveis
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` e o backend em `http://localhost:5000`.

---

## Deploy

- **Frontend:** Vercel — conectar ao repositório e definir `VITE_API_URL` como variável de ambiente
- **Backend:** Render — conectar ao repositório, definir as variáveis de ambiente e apontar o start command para `node src/server.js`

---

## Autores

Projeto desenvolvido para a disciplina de **Programação Web**.
