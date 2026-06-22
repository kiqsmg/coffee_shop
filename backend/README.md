# API — Coffee Shop (backend)

Referência das rotas para o frontend consumir.

- **Base URL (dev):** `http://localhost:5000`
- **Formato:** JSON em tudo (request e response).
- **Autenticação:** JWT no header `Authorization: Bearer <token>`. O token vem no
  retorno de `register` e `login` e vale **7 dias**.
- **Erros:** sempre no formato `{ "message": "..." }` com o status HTTP correspondente.

| Status | Quando acontece |
|---|---|
| 400 | Dados duplicados / inválidos |
| 401 | Sem token, token inválido, ou login errado |
| 403 | Autenticado mas sem permissão (ex.: cliente em rota de admin) |
| 404 | Recurso não encontrado |
| 500 | Erro inesperado no servidor |

---

## Autenticação — `/api/auth` (público)

### POST `/api/auth/register`
Cadastra um usuário e já devolve o token.

Body:
```json
{ "name": "Maria", "email": "maria@cafe.com", "password": "123456" }
```
- Todo cadastro nasce como `customer`. O `role` **não** é aceito pelo cliente
  (evita auto-cadastro de admin); admins são promovidos manualmente no banco.

Resposta `201`:
```json
{ "_id": "...", "name": "Maria", "email": "maria@cafe.com", "role": "customer", "token": "eyJ..." }
```
Erros: `400` email já cadastrado.

### POST `/api/auth/login`
Body:
```json
{ "email": "maria@cafe.com", "password": "123456" }
```
Resposta `200`: igual ao register (com `token`). Erro: `401` email ou senha inválidos.

---

## Produtos — `/api/products` (requer token)

Leitura: qualquer usuário autenticado. Escrita (POST/PUT/DELETE): **somente admin**.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/products` | autenticado | Lista todos (mais novos primeiro) |
| GET | `/api/products/:id` | autenticado | Um produto |
| POST | `/api/products` | admin | Cria |
| PUT | `/api/products/:id` | admin | Edita (parcial) |
| DELETE | `/api/products/:id` | admin | Remove |

**Formato do produto:**
```json
{
  "_id": "...",
  "code": "CAFE01",
  "name": "Cafe Latte",
  "ingredients": ["cafe", "leite"],
  "imageUrl": "",
  "category": "Bebida",
  "price": 12,
  "available": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**POST/PUT body:** `code` e `name` são obrigatórios e únicos; `price` é obrigatório.
Os demais (`ingredients`, `imageUrl`, `category`, `available`) são opcionais.
No PUT envie só os campos que quer mudar.

Respostas: `200` (GET/PUT), `201` (POST), `DELETE` → `{ "message": "Produto removido" }`.
Erros: `400` código/nome duplicado · `403` não-admin · `404` id inexistente.

---

## Usuários — `/api/users` (requer token)

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/users/:id` | autenticado | Perfil (sem a senha) |
| PUT | `/api/users/:id` | **o próprio** | Atualiza o próprio cadastro |

**PUT body** (todos opcionais — envie só o que mudar):
```json
{ "name": "Novo Nome", "email": "novo@cafe.com", "password": "novaSenha" }
```
Resposta `200`: `{ "_id", "name", "email", "role" }`.
Erros: `403` ao tentar editar o cadastro de outro usuário · `404` id inexistente.

---

## Exemplo de consumo (fetch)

```js
// login
const res = await fetch(`${API_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { token } = await res.json();

// chamada autenticada
const produtos = await fetch(`${API_URL}/api/products`, {
  headers: { Authorization: `Bearer ${token}` },
}).then((r) => r.json());
```

> No frontend, use `import.meta.env.VITE_API_URL` como `API_URL` (em dev: `http://localhost:5000`).
> O CORS do backend está aberto para qualquer origem.
