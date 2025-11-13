const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')

// Simple auth helper: try read Bearer token, otherwise return null
function getUserIdFromHeader(req){
  const header = req.headers.authorization
  if(!header) return null
  const parts = header.split(' ')
  if(parts.length!==2) return null
  const token = parts[1]
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    return data.userId
  }catch(e){
    return null
  }
}

// GET /reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/summary', async (req,res)=>{
  const from = req.query.from || '1970-01-01'
  const to = req.query.to || new Date().toISOString().slice(0,10)
  const userId = getUserIdFromHeader(req) || 1 // fallback to demo user id 1
  try{
    const incomeSql = `SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE user_id=$1 AND type='income' AND date BETWEEN $2 AND $3`
    const expenseSql = `SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE user_id=$1 AND type='expense' AND date BETWEEN $2 AND $3`
    const byCatSql = `SELECT category, COALESCE(SUM(amount),0) as total FROM transactions WHERE user_id=$1 AND date BETWEEN $2 AND $3 GROUP BY category ORDER BY total DESC`

    const incRes = await db.query(incomeSql, [userId, from, to])
    const expRes = await db.query(expenseSql, [userId, from, to])
    const catRes = await db.query(byCatSql, [userId, from, to])

    const incomeTotal = parseFloat(incRes.rows[0].total || 0)
    const expenseTotal = parseFloat(expRes.rows[0].total || 0)
    const balance = incomeTotal - expenseTotal

    res.json({
      period: { from, to },
      incomeTotal,
      expenseTotal,
      balance,
      byCategory: catRes.rows
    })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
