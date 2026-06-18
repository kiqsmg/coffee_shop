import { MongoMemoryServer } from 'mongodb-memory-server';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Teste manual: sobe um MongoDB em memoria e exercita /api/auth.
// Rodar com: node "manual tests/smoke-auth.mjs"
// Fica em loop ate o usuario digitar "close" (ou Ctrl+C).

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri();
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = '5050';

await import('../src/server.js');

const base = 'http://localhost:5050';
const post = async (path, body) =>
  fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

// Espera o servidor ficar de pé
for (let i = 0; i < 50; i++) {
  try {
    await post('/api/auth/login', {});
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}

const log = (label, cond, extra) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${label}`, extra ?? '');
};

const rl = readline.createInterface({ input, output });

console.log('\n--- Smoke /api/auth interativo ---');
console.log('Digite "close" a qualquer momento para encerrar.\n');

const ask = async (q) => {
  const v = await rl.question(q);
  if (v.trim().toLowerCase() === 'close') return null;
  return v;
};

while (true) {
  console.log('\n--- Novo usuario ---');
  const name = await ask('Nome: ');
  if (name === null) break;
  const email = await ask('Email: ');
  if (email === null) break;
  const password = await ask('Senha: ');
  if (password === null) break;
  const role = await ask('Role (admin/customer): ');
  if (role === null) break;

  const user = { name, email, password, role };

  let r = await post('/api/auth/register', user);
  let b = await r.json().catch(() => ({}));
  log('register', r.status === 201 && !!b.token, `status=${r.status} ${b.message ?? ''}`);

  r = await post('/api/auth/register', user);
  b = await r.json().catch(() => ({}));
  log('register duplicado bloqueado', r.status === 400, `status=${r.status} ${b.message ?? ''}`);

  r = await post('/api/auth/login', { email, password });
  b = await r.json().catch(() => ({}));
  log('login correto', r.status === 200 && !!b.token, `status=${r.status} ${b.message ?? ''}`);

  r = await post('/api/auth/login', { email, password: 'senha_errada_aleatoria' });
  log('login senha errada rejeitado', r.status === 401, `status=${r.status}`);
}

console.log('\nEncerrando...');
rl.close();
await mongod.stop();
process.exit(0);
