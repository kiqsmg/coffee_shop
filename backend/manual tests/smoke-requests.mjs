import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User.js';

// Teste isolado: exercita /api/requests (chamado "peca agora").
// Rodar com: node "manual tests/smoke-requests.mjs"

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri();
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = '5055';

await import('../src/server.js');

const base = 'http://localhost:5055';
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

// admin (promovido no banco) e cliente
const register = async (email) => {
  const r = await req('/api/auth/register', 'POST', { name: email.split('@')[0], email, password: '123456' });
  return r.json();
};
const admin = await register('admin@cafe.com');
await User.updateOne({ email: 'admin@cafe.com' }, { role: 'admin' });
const cliente = await register('joao@cafe.com');

// admin cria um produto
let r = await req('/api/products', 'POST', { code: 'CAFE01', name: 'Cappuccino', price: 12 }, admin.token);
const produto = await r.json();

// cliente faz um chamado
r = await req('/api/requests', 'POST', { productId: produto._id }, cliente.token);
let b = await r.json();
check('cliente cria chamado (201)', r.status === 201 && b.status === 'pendente', `status=${r.status}`);
check('chamado guarda nome do cliente e do produto', b.userName === 'joao' && b.productName === 'Cappuccino', `${b.userName}/${b.productName}`);
const chamadoId = b._id;

// chamado sem token bloqueado
r = await req('/api/requests', 'POST', { productId: produto._id });
check('chamado sem token bloqueado (401)', r.status === 401, `status=${r.status}`);

// cliente NAO pode listar chamados
r = await req('/api/requests', 'GET', null, cliente.token);
check('cliente nao lista chamados (403)', r.status === 403, `status=${r.status}`);

// admin lista e ve o chamado (dado compartilhado entre usuarios)
r = await req('/api/requests', 'GET', null, admin.token);
b = await r.json();
check('admin ve o chamado do cliente', r.status === 200 && b.length === 1, `qtd=${b.length}`);

// admin marca como atendido
r = await req(`/api/requests/${chamadoId}`, 'PUT', null, admin.token);
b = await r.json();
check('admin marca como atendido', r.status === 200 && b.status === 'atendido', `status=${b.status}`);

await mongod.stop();
console.log(ok ? '\nTODOS OS TESTES PASSARAM' : '\nALGUM TESTE FALHOU');
process.exit(ok ? 0 : 1);
