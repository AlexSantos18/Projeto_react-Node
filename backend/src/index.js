require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const txRoutes = require('./routes/transactions');
const debugRoutes = require('./routes/debug');
const reportsRoutes = require('./routes/reports');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ROTAS COM PADRÃO REST
app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/reports', reportsRoutes);

// TESTE RÁPIDO
app.get('/', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend rodando na porta ${port}`));
