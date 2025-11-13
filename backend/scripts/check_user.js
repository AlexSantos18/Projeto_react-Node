require('dotenv').config()
const db = require('../src/db')
const bcrypt = require('bcrypt')

async function run(){
  try{
    const email = process.env.CHECK_EMAIL || 'test@example.com'
    const testPassword = process.env.CHECK_PASSWORD || 'password123'
    const r = await db.query('SELECT id,email,password,created_at FROM users WHERE email=$1', [email])
    if(r.rows.length===0){
      console.log('Usuário não encontrado:', email)
      process.exit(0)
    }
    const user = r.rows[0]
    console.log('Usuário encontrado:', { id: user.id, email: user.email, created_at: user.created_at })
    const hash = user.password
    console.log('Hash (primeiros 20 chars):', hash ? hash.slice(0,20) + '...' : null)
    const ok = await bcrypt.compare(testPassword, hash)
    console.log(`Comparação com senha '${testPassword}':`, ok)
    if(!ok){
      console.log('Tente rodar o seed novamente para resetar a senha do usuário de teste.')
    }
    process.exit(0)
  }catch(err){
    console.error('Erro ao verificar usuário:', err)
    process.exit(1)
  }
}

run()
