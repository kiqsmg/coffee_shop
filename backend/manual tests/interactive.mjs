import { MongoMemoryServer } from 'mongodb-memory-server';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import User from '../src/models/User.js';

// Tester interativo: voce dirige a jornada pelo terminal.
// Sobe um MongoDB em memoria (nao precisa de .env nem Atlas).
// Rodar com: node "manual tests/interactive.mjs"

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri();
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = '5053';

await import('../src/server.js');

const base = 'http://localhost:5053';
let token = null; // guarda o token do ultimo login/registro
let userInfo = null;

const req = async (path, method, body) => {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  console.log(`\n  -> ${method} ${path}  [status ${res.status}]`);
  console.log('  ', JSON.stringify(data, null, 2).replace(/\n/g, '\n  '));
  return data;
};

// Espera o servidor ficar de pe
for (let i = 0; i < 50; i++) {
  try {
    await fetch(base + '/api/products');
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}

const rl = readline.createInterface({ input, output });
const ask = (q) => rl.question(q);

const menu = `
============== Coffee Shop - Tester ==============
Usuario atual: ${'%USER%'}
  1) Registrar usuario
  2) Login
  3) Listar produtos
  4) Ver produto por id
  5) Criar produto        (admin)
  6) Editar produto       (admin)
  7) Remover produto      (admin)
  8) Mostrar meu token
  9) Atualizar meu cadastro
  0) Sair
=================================================`;

while (true) {
  const quem = userInfo ? `${userInfo.name} (${userInfo.role})` : 'nenhum (deslogado)';
  console.log(menu.replace('%USER%', quem));
  const op = (await ask('Escolha: ')).trim();

  if (op === '0') break;

  if (op === '1') {
    const name = await ask('Nome: ');
    const email = await ask('Email: ');
    const password = await ask('Senha: ');
    const role = await ask('Role (admin/customer) [enter=customer]: ');
    const data = await req('/api/auth/register', 'POST', { name, email, password });
    // A API sempre cria 'customer'. Aqui (dev) promovemos direto no banco se pedir admin.
    if (data._id && role.trim().toLowerCase() === 'admin') {
      await User.updateOne({ email }, { role: 'admin' });
      data.role = 'admin';
      console.log('  (dev) usuario promovido a admin direto no banco');
    }
    if (data.token) { token = data.token; userInfo = data; }
  } else if (op === '2') {
    const email = await ask('Email: ');
    const password = await ask('Senha: ');
    const data = await req('/api/auth/login', 'POST', { email, password });
    if (data.token) { token = data.token; userInfo = data; }
  } else if (op === '3') {
    await req('/api/products', 'GET');
  } else if (op === '4') {
    const id = await ask('ID do produto: ');
    await req(`/api/products/${id}`, 'GET');
  } else if (op === '5') {
    const code = await ask('Codigo: ');
    const name = await ask('Nome: ');
    const price = await ask('Preco: ');
    await req('/api/products', 'POST', { code, name, price: Number(price) });
  } else if (op === '6') {
    const id = await ask('ID do produto: ');
    const price = await ask('Novo preco: ');
    await req(`/api/products/${id}`, 'PUT', { price: Number(price) });
  } else if (op === '7') {
    const id = await ask('ID do produto: ');
    await req(`/api/products/${id}`, 'DELETE');
  } else if (op === '8') {
    console.log('\n  token:', token ?? '(deslogado)');
  } else if (op === '9') {
    if (!userInfo) { console.log('  faca login primeiro'); continue; }
    const name = await ask('Novo nome [enter=manter]: ');
    const email = await ask('Novo email [enter=manter]: ');
    const password = await ask('Nova senha [enter=manter]: ');
    const body = {};
    if (name.trim()) body.name = name.trim();
    if (email.trim()) body.email = email.trim();
    if (password.trim()) body.password = password.trim();
    const data = await req(`/api/users/${userInfo._id}`, 'PUT', body);
    if (data._id) userInfo = { ...userInfo, ...data };
  } else {
    console.log('  opcao invalida');
  }
}

console.log('\nEncerrando...');
rl.close();
await mongod.stop();
process.exit(0);
