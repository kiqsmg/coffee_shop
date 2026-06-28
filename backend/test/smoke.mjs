import { MongoMemoryServer } from 'mongodb-memory-server';

// Automated smoke test — runs without user input, exits 0 (pass) or 1 (fail).
// Uses an in-memory MongoDB so no real database is needed.

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri();
process.env.JWT_SECRET = 'test_secret_automated';
process.env.PORT = '5099';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

await import('../src/server.js');

const base = 'http://localhost:5099';
let passed = 0;
let failed = 0;

// Wait for server to be ready
for (let i = 0; i < 50; i++) {
  try {
    await fetch(base + '/');
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}

const post = (path, body, token) =>
  fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });

const get = (path, token) =>
  fetch(base + path, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

const put = (path, body, token) =>
  fetch(base + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });

const del = (path, token) =>
  fetch(base + path, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });

const check = (label, cond, detail = '') => {
  if (cond) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
};

// ─── Auth ────────────────────────────────────────────────────────────────────
console.log('\n[Auth]');

let r, b;

r = await post('/api/auth/register', {});
check('register sem campos retorna 400', r.status === 400);

r = await post('/api/auth/register', { name: 'Ana', email: 'ana@test.com', password: '123456' });
b = await r.json();
check('register valido retorna 201 com token', r.status === 201 && !!b.token, `status=${r.status}`);
const customerToken = b.token;
const customerId = b._id;

r = await post('/api/auth/register', { name: 'Ana2', email: 'ana@test.com', password: '123456' });
check('register email duplicado retorna 400', r.status === 400);

r = await post('/api/auth/login', { email: 'ana@test.com', password: '123456' });
b = await r.json();
check('login correto retorna 200 com token', r.status === 200 && !!b.token);

r = await post('/api/auth/login', { email: 'ana@test.com', password: 'senha_errada' });
check('login senha errada retorna 401', r.status === 401);

r = await post('/api/auth/login', { email: 'naoexiste@test.com', password: '123456' });
check('login email inexistente retorna 401', r.status === 401);

r = await post('/api/auth/login', {});
check('login sem campos retorna 400', r.status === 400);

// ─── Token inválido ───────────────────────────────────────────────────────────
console.log('\n[Token inválido]');

r = await get('/api/products', 'token_invalido');
check('token invalido retorna 401', r.status === 401);

r = await get('/api/products');
check('sem token retorna 401', r.status === 401);

// ─── Products (unauthenticated) ──────────────────────────────────────────────
console.log('\n[Products — sem token]');

r = await get('/api/products');
check('GET /products sem token retorna 401', r.status === 401);

// ─── Products (customer) ─────────────────────────────────────────────────────
console.log('\n[Products — customer]');

r = await get('/api/products', customerToken);
check('GET /products autenticado retorna 200', r.status === 200);

r = await post('/api/products', { code: 'CAP01', name: 'Cappuccino', price: 12 }, customerToken);
check('POST /products como customer retorna 403', r.status === 403);

// ─── Admin setup (direct DB promotion) ───────────────────────────────────────
// Register admin user then promote via DB (same pattern as manual tests)
r = await post('/api/auth/register', { name: 'Admin', email: 'admin@test.com', password: 'admin123' });
b = await r.json();
const adminId = b._id;

// Promote to admin by importing User model directly
const { default: User } = await import('../src/models/User.js');
await User.updateOne({ _id: adminId }, { role: 'admin' });

r = await post('/api/auth/login', { email: 'admin@test.com', password: 'admin123' });
b = await r.json();
const adminToken = b.token;

// ─── Products (admin CRUD) ────────────────────────────────────────────────────
console.log('\n[Products — admin CRUD]');

r = await post('/api/products', { code: 'CAP01', name: 'Cappuccino', price: 12 }, adminToken);
b = await r.json();
check('POST /products como admin retorna 201', r.status === 201, `status=${r.status}`);
const productId = b._id;

r = await post('/api/products', { code: 'CAP01', name: 'Outro', price: 5 }, adminToken);
check('POST /products codigo duplicado retorna 400', r.status === 400);

r = await post('/api/products', { code: 'CAP02', name: 'Cappuccino', price: 5 }, adminToken);
check('POST /products nome duplicado retorna 400', r.status === 400);

r = await post('/api/products', { name: 'Sem codigo', price: 5 }, adminToken);
check('POST /products sem code retorna 400', r.status === 400);

r = await post('/api/products', { code: 'X01', name: 'Sem preco' }, adminToken);
check('POST /products sem price retorna 400', r.status === 400);

r = await get(`/api/products/${productId}`, adminToken);
check('GET /products/:id retorna 200', r.status === 200);

r = await get(`/api/products/${productId}`, customerToken);
check('GET /products/:id como customer retorna 200', r.status === 200);

r = await put(`/api/products/${productId}`, { price: 15 }, adminToken);
check('PUT /products/:id retorna 200', r.status === 200);

r = await put(`/api/products/${productId}`, { price: -1 }, adminToken);
check('PUT /products/:id preco negativo retorna 400', r.status === 400);

r = await put(`/api/products/${productId}`, { price: 10 }, customerToken);
check('PUT /products/:id como customer retorna 403', r.status === 403);

r = await del(`/api/products/${productId}`, customerToken);
check('DELETE /products/:id como customer retorna 403', r.status === 403);

const fakeId = '000000000000000000000000';

r = await get(`/api/products/${fakeId}`, adminToken);
check('GET /products/:id inexistente retorna 404', r.status === 404);

r = await put(`/api/products/${fakeId}`, { price: 10 }, adminToken);
check('PUT /products/:id inexistente retorna 404', r.status === 404);

r = await del(`/api/products/${fakeId}`, adminToken);
check('DELETE /products/:id inexistente retorna 404', r.status === 404);

r = await del(`/api/products/${productId}`, adminToken);
check('DELETE /products/:id retorna 200', r.status === 200);

r = await get(`/api/products/${productId}`, adminToken);
check('GET /products/:id apos delete retorna 404', r.status === 404);

// ─── Users ────────────────────────────────────────────────────────────────────
console.log('\n[Users]');

r = await get(`/api/users/${customerId}`);
check('GET /users/:id sem token retorna 401', r.status === 401);

r = await get(`/api/users/${customerId}`, customerToken);
check('GET /users/:id retorna 200', r.status === 200);

r = await get(`/api/users/${fakeId}`, adminToken);
check('GET /users/:id inexistente retorna 404', r.status === 404);

r = await put(`/api/users/${customerId}`, { name: 'Ana Editada' }, customerToken);
check('PUT /users/:id proprio usuario retorna 200', r.status === 200);

r = await put(`/api/users/${customerId}`, { email: 'invalido' }, customerToken);
check('PUT /users/:id email invalido retorna 400', r.status === 400);

r = await put(`/api/users/${customerId}`, { password: '123' }, customerToken);
check('PUT /users/:id senha curta retorna 400', r.status === 400);

// Register a third user to test duplicate email on update
r = await post('/api/auth/register', { name: 'Outro', email: 'outro@test.com', password: '123456' });
b = await r.json();
const outroToken = b.token;
const outroId = b._id;

r = await put(`/api/users/${outroId}`, { email: 'ana@test.com' }, outroToken);
check('PUT /users/:id email duplicado retorna 400', r.status === 400);

r = await put(`/api/users/${adminId}`, { name: 'Hack' }, customerToken);
check('PUT /users/:id outro usuario retorna 403', r.status === 403);

// ─── 404 ─────────────────────────────────────────────────────────────────────
console.log('\n[404]');
r = await get('/api/rota-inexistente', customerToken);
check('Rota inexistente retorna 404', r.status === 404);

// ─── Result ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`Resultado: ${passed} passed, ${failed} failed`);

await mongod.stop();
process.exit(failed > 0 ? 1 : 0);
