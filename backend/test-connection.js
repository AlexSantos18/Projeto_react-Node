// backend/test-connection.js
// Execute: node test-connection.js

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    console.log('🔄 Tentando conectar ao banco de dados...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const client = await pool.connect();
    console.log('✅ Conexão com banco estabelecida!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executada com sucesso:', result.rows[0]);
    
    // Testa se a tabela users existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Tabela "users" encontrada');
      
      // Conta quantos usuários existem
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`✅ Usuários cadastrados: ${userCount.rows[0].count}`);
    } else {
      console.log('❌ Tabela "users" não encontrada! Execute a migração.');
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testConnection();