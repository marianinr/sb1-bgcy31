const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'financiera_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Rutas de la API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'adminroot735' && password === 'ddwrtxxxv1$$') {
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas protegidas
app.use('/api', authenticateToken);

// Ruta para obtener todos los clientes
app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM clients ORDER BY next_payment_date', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching clients' });
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo cliente
app.post('/api/clients', (req, res) => {
  const { name, address, phone, amount, plan } = req.body;
  // Aquí deberías calcular las fechas de pago y el monto total basado en el plan
  db.query('INSERT INTO clients (name, address, phone, amount, plan) VALUES (?, ?, ?, ?, ?)',
    [name, address, phone, amount, plan],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error adding client' });
        return;
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// Ruta para actualizar un cliente
app.put('/api/clients/:id', (req, res) => {
  const { name, address, phone, amount, plan } = req.body;
  db.query('UPDATE clients SET name = ?, address = ?, phone = ?, amount = ?, plan = ? WHERE id = ?',
    [name, address, phone, amount, plan, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error updating client' });
        return;
      }
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Ruta para registrar un pago
app.post('/api/clients/:id/payments', (req, res) => {
  const { amount } = req.body;
  // Aquí deberías actualizar el estado del cliente y las fechas de pago
  db.query('INSERT INTO payments (client_id, amount) VALUES (?, ?)',
    [req.params.id, amount],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error registering payment' });
        return;
      }
      res.status(201).json({ message: 'Payment registered successfully' });
    }
  );
});

// Ruta para obtener el resumen
app.get('/api/summary', (req, res) => {
  // Aquí deberías calcular el resumen basado en los datos de la base de datos
  const summary = {
    active_clients: 0,
    due_today: 0,
    late_clients: 0
  };
  res.json(summary);
});

// Ruta para obtener el historial de pagos de un cliente
app.get('/api/clients/:id/payments', (req, res) => {
  db.query('SELECT * FROM payments WHERE client_id = ? ORDER BY payment_date DESC',
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching payment history' });
        return;
      }
      res.json(results);
    }
  );
});

// Ruta para renovar el plan de un cliente
app.post('/api/clients/:id/renew', (req, res) => {
  const { amount, plan } = req.body;
  // Aquí deberías actualizar el plan del cliente y recalcular las fechas de pago
  db.query('UPDATE clients SET amount = ?, plan = ?, status = "active" WHERE id = ?',
    [amount, plan, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error renewing plan' });
        return;
      }
      res.json({ message: 'Plan renewed successfully' });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));