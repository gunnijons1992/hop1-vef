require('dotenv').config();
const express = require('express');
const api = require('./api');
const users = require('./users');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-local');

const app = express();

app.use(express.json());
app.use('/', api);

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret = 'notaðu .env!',
    HOST: host = '127.0.0.1',
} = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

async function strat(username, passwd, done) {
  const user = await users.findByUsername(username);

  if (!user) {
    return done(null, false);
  }

  let result = false;
  try {
    result = await users.comparePasswords(passwd, user.passwd);
  } catch (error) {
    done(error);
  }

  if (result) {
    return done(null, user);
  }

  return done(null, false);
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(`
      <p>Innskráning sem ${req.user.userpasswd}</p>
      <p><a href="/logout">Útskráning</a></p>
      <p><a href="/admin">Skoða leyndarmál</a></p>
    `);
  }

  return res.send(`
  <p><a href="/login">Innskráning</a></p>
  <p><a href="/register">Búa til notanda</a></p>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <label>Notendanafn: <input type="text" name="username"></label>
      <label>Lykilorð: <input type="password" name="passwd"></label>
      <button>Innskrá</button>
    </form>
  `);
});

app.get('/register', (req, res) => {
  res.send(`
    <h2>Búa til notanda</h2>
    <form method="post" action="/register">
      <label>Notendanafn: <input type="text" name="username"></label>
      <label>Lykilorð: <input type="password" name="passwd"></label>
      <labe;>Nafn: <input type="name" name="name"></label>
      <label>Mynd: <input type="imgName" name="imgName"></label>

      <button>Innskrá</button>
    </form>
  `);
});

// hér væri hægt að bæta við enn frekari (og betri) staðfestingu á gögnum
async function validateUser(username, passwd) {
  if (typeof username !== 'string' || username.length < 2) {
    return 'Notendanafn verður að vera amk 2 stafir';
  }

  const user = await users.findByUsername(username);

  if (user) {
    return 'Notendanafn er þegar skráð';
  }

  if (typeof passwd !== 'string' || passwd.length < 6) {
    return 'Lykilorð verður að vera amk 6 stafir';
  }
}

async function register(req, res, next) {
  const { username, passwd, name, imgName } = req.body;

  const validationMessage = await validateUser(username, passwd);

  if (validationMessage) {
    res.send(`
      <p>${validationMessage}</p>
      <a href="/register">Reyna aftur</a>
    `);
  }

  const result = await users.createUser(username, passwd, name, imgName);

  // næsta middleware mun sjá um að skrá notanda inn því hann verður til
  // og `username` og `password` verða ennþá sett sem rétt í `req`
  next();
}

app.post(
  '/register',
  register,
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/admin', ensureLoggedIn, (req, res) => {
  res.send(`
    <p>Hér eru leyndarmál</p>
    <p><a href="/">Forsíða</a></p>
  `);
});


function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);


app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
