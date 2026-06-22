import { MongoMemoryServer } from 'mongodb-memory-server';

// Teste isolado: sobe um MongoDB em memoria e exercita /api/products.
// Rodar com: node "manual tests/smoke-products.mjs"

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri();
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = '5051';

await import('../src/server.js');

const base = 'http://localhost:5051';
const req = async (path, method, body, token) =>
  fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

// Espera o servidor ficar de pe
for (let i = 0; i < 50; i++) {
  try {
    await req('/api/products', 'GET');
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}

let ok = true;
const check = (label, cond, extra) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${label}`, extra ?? '');
  if (!cond) ok = false;
};

// Cria um admin e um cliente e guarda os tokens
const register = async (role) => {
  const r = await req('/api/auth/register', 'POST', {
    name: role,
    email: `${role}@cafe.com`,
    password: '123456',
    role,
  });
  return (await r.json()).token;
};
const adminToken = await register('admin');
const customerToken = await register('customer');

// Sem token nao acessa nada
let r = await req('/api/products', 'GET');
check('lista sem token bloqueada (401)', r.status === 401, `status=${r.status}`);

// Cliente nao pode criar produto
r = await req('/api/products', 'POST', { code: 'C1', name: 'Cafe', price: 5 }, customerToken);
check('cliente nao cria produto (403)', r.status === 403, `status=${r.status}`);

// Admin cria produto
r = await req('/api/products', 'POST', { code: 'C1', name: 'Cafe', price: 5 }, adminToken);
let b = await r.json();
check('admin cria produto (201)', r.status === 201 && !!b._id, `status=${r.status}`);
const id = b._id;

// Codigo/nome duplicado bloqueado
r = await req('/api/products', 'POST', { code: 'C1', name: 'Cafe', price: 5 }, adminToken);
check('produto duplicado bloqueado (400)', r.status === 400, `status=${r.status}`);

// Cliente ve o produto criado pelo admin (dado compartilhado entre usuarios)
r = await req('/api/products', 'GET', null, customerToken);
b = await r.json();
check('cliente ve produto do admin', r.status === 200 && b.length === 1, `qtd=${b.length}`);

// Busca por id
r = await req(`/api/products/${id}`, 'GET', null, customerToken);
check('busca por id (200)', r.status === 200, `status=${r.status}`);

// Admin atualiza o preco
r = await req(`/api/products/${id}`, 'PUT', { price: 9 }, adminToken);
b = await r.json();
check('admin atualiza preco', r.status === 200 && b.price === 9, `price=${b.price}`);

// Admin remove
r = await req(`/api/products/${id}`, 'DELETE', null, adminToken);
check('admin remove produto (200)', r.status === 200, `status=${r.status}`);

// Produto removido retorna 404
r = await req(`/api/products/${id}`, 'GET', null, adminToken);
check('produto removido retorna 404', r.status === 404, `status=${r.status}`);

await mongod.stop();
console.log(ok ? '\nTODOS OS TESTES PASSARAM' : '\nALGUM TESTE FALHOU');
process.exit(ok ? 0 : 1);
