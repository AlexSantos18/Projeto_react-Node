-- Tabelas iniciais
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'income'|'expense'
  amount NUMERIC(12,2) NOT NULL,
  category TEXT,
  date DATE DEFAULT now(),
  note TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Exemplo de categorias pré-definidas podem ser mantidas no frontend
