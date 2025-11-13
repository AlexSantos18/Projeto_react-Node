require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const txRoutes = require('./routes/transactions')
const debugRoutes = require('./routes/debug')
const reportsRoutes = require('./routes/reports')

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/transactions', txRoutes)
app.use('/debug', debugRoutes)
app.use('/reports', reportsRoutes)

app.get('/', (req,res)=> res.json({ ok:true }))

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log(`Backend rodando na porta ${port}`))
