const express = require('express')
const router = express.Router()
const db = require('../db')

function maskDatabaseUrl(url){
  if(!url || typeof url !== 'string') return null
  try{
    const m = url.match(/^(postgresql:\/\/)([^:]+):([^@]+)@(.+)$/)
    if(!m) return url
    const prefix = m[1]
    const user = m[2]
    // mask password
    return `${prefix}${user}:****@${m[4]}`
  }catch(e){
    return null
  }
}

function isLocalRequest(req){
  const ip = req.ip || (req.connection && req.connection.remoteAddress) || ''
  // common loopback representations
  const allowed = ['::1','127.0.0.1','::ffff:127.0.0.1']
  return allowed.includes(ip)
}

router.get('/db', async (req,res)=>{
  // endpoint de debug leve - não exponha em produção
  // Regras:
  // - se NODE_ENV === 'production' -> negar
  // - permitir apenas requisições locais (loopback) ou se o header 'X-DEBUG-KEY' bater com DEBUG_KEY
  if(process.env.NODE_ENV === 'production'){
    return res.status(404).json({ ok:false, message: 'Not found' })
  }

  const raw = process.env.DATABASE_URL
  const masked = maskDatabaseUrl(raw)

  const debugKey = process.env.DEBUG_KEY
  const headerKey = req.get('X-DEBUG-KEY')
  if(debugKey && headerKey && headerKey === debugKey){
    // allow when correct key provided
  } else if(!isLocalRequest(req)){
    return res.status(403).json({ ok:false, message: 'Forbidden - debug only available locally' })
  }

  try{
    // tenta uma query simples para validar conexão
    await db.query('SELECT 1')
    res.json({ ok:true, databaseUrl: masked })
  }catch(err){
    res.status(500).json({ ok:false, databaseUrl: masked, error: err.message })
  }
})

module.exports = router
