const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res)=>{
  const { name, email, password } = req.body
  if(!email||!password) return res.status(400).json({ message: 'Email e senha obrigatórios' })
  const hashed = await bcrypt.hash(password, 10)
  try{
    const r = await db.query('INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id,name,email', [name,email,hashed])
    res.json(r.rows[0])
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req,res)=>{
  const { email, password } = req.body
  if(!email||!password) return res.status(400).json({ message: 'Email e senha obrigatórios' })
  try{
    const r = await db.query('SELECT * FROM users WHERE email=$1', [email])
    const user = r.rows[0]
    if(!user) return res.status(401).json({ message: 'Credenciais inválidas' })
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(401).json({ message: 'Credenciais inválidas' })
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
    res.json({ token })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
