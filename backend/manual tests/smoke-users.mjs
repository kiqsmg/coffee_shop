import { MongoMemoryServer } from 'mongodb-memory-server';

// Teste isolado: exercita /api/users (perfil e atualizacao do proprio cadastro).
// Rodar com: node "manual tests/smoke-users.mjs"

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri();
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = '5054';

await import('../src/server.js');

const base = 'http://localhost:5054';
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

// Registra dois usuarios distintos
const register = async (email) => {
  const r = await req('/api/auth/register', 'POST', { name: email, email, password: '123456' });
  return r.json();
};
const ana = await register('ana@cafe.com');
const bia = await register('bia@cafe.com');

// Sem token nao acessa perfil
let r = await req(`/api/users/${ana._id}`, 'GET');
check('perfil sem token bloqueado (401)', r.status === 401, `status=${r.status}`);

// Busca o proprio perfil sem expor a senha
r = await req(`/api/users/${ana._id}`, 'GET', null, ana.token);
let b = await r.json();
check('perfil retorna sem senha (200)', r.status === 200 && b.password === undefined, `status=${r.status}`);

// Atualiza o proprio nome
r = await req(`/api/users/${ana._id}`, 'PUT', { name: 'Ana Maria' }, ana.token);
b = await r.json();
check('atualiza proprio nome', r.status === 200 && b.name === 'Ana Maria', `name=${b.name}`);

// Nao pode atualizar o cadastro de outro usuario
r = await req(`/api/users/${bia._id}`, 'PUT', { name: 'Invadida' }, ana.token);
check('nao edita cadastro de outro (403)', r.status === 403, `status=${r.status}`);

// Troca a senha e confirma que o login novo funciona (pre-save re-hasheia)
r = await req(`/api/users/${ana._id}`, 'PUT', { password: 'novasenha' }, ana.token);
check('troca de senha (200)', r.status === 200, `status=${r.status}`);
r = await req('/api/auth/login', 'POST', { email: 'ana@cafe.com', password: 'novasenha' });
check('login com a nova senha funciona', r.status === 200, `status=${r.status}`);

await mongod.stop();
console.log(ok ? '\nTODOS OS TESTES PASSARAM' : '\nALGUM TESTE FALHOU');
process.exit(ok ? 0 : 1);
