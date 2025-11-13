const express = require('express')
const router = express.Router()
const db = require('../db')

// Simple auth middleware (expect Authorization: Bearer <token>)
const jwt = require('jsonwebtoken')
function auth(req,res,next){
  const header = req.headers.authorization
  if(!header) return res.status(401).json({ message: 'Sem autorização' })
  const token = header.split(' ')[1]
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    req.userId = data.userId
    next()
  }catch(err){
    res.status(401).json({ message: 'Token inválido' })
  }
}

// GET /transactions?from=YYYY-MM-DD&to=YYYY-MM-DD&category=...
router.get('/', auth, async (req,res)=>{
  const { from, to, category } = req.query
  let sql = 'SELECT * FROM transactions WHERE user_id=$1'
  const params = [req.userId]
  if(from){ params.push(from); sql += ` AND date >= $${params.length}` }
  if(to){ params.push(to); sql += ` AND date <= $${params.length}` }
  if(category){ params.push(category); sql += ` AND category = $${params.length}` }
  sql += ' ORDER BY date DESC'
  try{
    const r = await db.query(sql, params)
    res.json(r.rows)
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req,res)=>{
  const { type, amount, category, date, note } = req.body
  if(!type || !amount) return res.status(400).json({ message: 'Tipo e valor obrigatórios' })
  try{
    const r = await db.query('INSERT INTO transactions(user_id,type,amount,category,date,note) VALUES($1,$2,$3,$4,$5,$6) RETURNING *', [req.userId,type,amount,category||'Outros',date||new Date(),note||''])
    res.json(r.rows[0])
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', auth, async (req,res)=>{
  const id = req.params.id
  const { type, amount, category, date, note } = req.body
  try{
    const r = await db.query('UPDATE transactions SET type=$1,amount=$2,category=$3,date=$4,note=$5 WHERE id=$6 AND user_id=$7 RETURNING *', [type,amount,category,date,note,id,req.userId])
    res.json(r.rows[0])
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req,res)=>{
  const id = req.params.id
  try{
    await db.query('DELETE FROM transactions WHERE id=$1 AND user_id=$2', [id, req.userId])
    res.json({ ok:true })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
