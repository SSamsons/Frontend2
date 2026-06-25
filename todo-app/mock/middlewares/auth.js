const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function createToken(userId) {
  const payload = { userId, exp: Date.now() + 60 * 60 * 1000 };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function parseToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function networkDelay(req, res, next) {
  const delayMs = 200 + Math.floor(Math.random() * 800);
  setTimeout(next, delayMs);
}

function corsHeaders(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function authRoutes(req, res, next) {
  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body ?? {};
    const db = readDb();
    const user = db.users.find((item) => item.email === email && item.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const { password: _password, ...safeUser } = user;
    return res.json({
      token: createToken(user.id),
      user: safeUser,
    });
  }

  if (req.method === 'POST' && req.path === '/auth/register') {
    const { email, password, name } = req.body ?? {};
    const db = readDb();
    const exists = db.users.some((item) => item.email === email);

    if (exists) {
      return res.status(400).json({ message: 'Email уже используется' });
    }

    const nextId = db.users.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const user = { id: nextId, email, password, name };
    db.users.push(user);
    writeDb(db);

    const { password: _password, ...safeUser } = user;
    return res.status(201).json({
      token: createToken(user.id),
      user: safeUser,
    });
  }

  if (req.method === 'POST' && req.path === '/auth/refresh') {
    const { token } = req.body ?? {};
    const payload = parseToken(token);

    if (!payload) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    return res.json({ token: createToken(payload.userId) });
  }

  next();
}

function requireAuth(req, res, next) {
  const protectedPrefixes = ['/todos', '/tags'];
  const isProtected = protectedPrefixes.some((prefix) => req.path.startsWith(prefix));

  if (!isProtected) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  const token = authHeader.slice(7);
  const payload = parseToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Недействительный или просроченный токен' });
  }

  req.userId = payload.userId;
  next();
}

module.exports = {
  networkDelay,
  corsHeaders,
  authRoutes,
  requireAuth,
};
