require('dotenv').config()
const db = require('../src/db')
const bcrypt = require('bcrypt')

async function run(){
  try{
    const email = process.env.TEST_USER_EMAIL || 'test@example.com'
    const newPass = process.env.SEED_TEST_PASSWORD || 'password123'
    const hashed = await bcrypt.hash(newPass, 10)
    const r = await db.query('UPDATE users SET password=$1 WHERE email=$2 RETURNING id,email', [hashed, email])
    if(r.rows.length===0){
      console.log('Usuário não encontrado:', email)
      process.exit(1)
    }
    console.log('Senha atualizada para usuário:', r.rows[0])
    console.log('Nova senha (texto):', newPass)
    process.exit(0)
  }catch(err){
    console.error('Erro ao atualizar senha:', err)
    process.exit(1)
  }
}

run()
