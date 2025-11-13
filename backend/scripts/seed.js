require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../src/db')

async function run(){
  try{
    // cria usuário de teste
    const passwordPlain = process.env.SEED_TEST_PASSWORD || 'password123'
    const hashed = await bcrypt.hash(passwordPlain, 10)

    const userRes = await db.query(
      'INSERT INTO users(name,email,password) VALUES($1,$2,$3) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING id',
      ['Usuário Teste', 'test@example.com', hashed]
    )
    const userId = userRes.rows[0].id
    console.log('Usuário inserido/atualizado com id=', userId)

    // transações de exemplo
    const txs = [
      ['income', 5000.00, 'Salário', '2025-09-01', 'Salário mensal'],
      ['expense', 1200.50, 'Aluguel', '2025-09-05', 'Pagamento aluguel'],
      ['expense', 300.00, 'Alimentação', '2025-09-10', 'Supermercado'],
      ['expense', 80.00, 'Transporte', '2025-09-12', 'Uber e ônibus'],
      ['expense', 150.00, 'Lazer', '2025-09-20', 'Cinema e passeios'],
      ['income', 200.00, 'Outros', '2025-09-25', 'Venda pequena']
    ]

    for(const t of txs){
      const [type, amount, category, date, note] = t
      await db.query(
        'INSERT INTO transactions(user_id,type,amount,category,date,note) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING',
        [userId, type, amount, category, date, note]
      )
    }

    console.log('Transações de exemplo inseridas.')
    console.log(`Credenciais de teste: email=test@example.com senha=${passwordPlain}`)
    process.exit(0)
  }catch(err){
    console.error('Erro ao seedar:', err)
    process.exit(1)
  }
}

run()
