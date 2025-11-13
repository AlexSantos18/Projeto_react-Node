// Script de verificação rápida: login -> summary -> create transaction -> list
// Requer Node 18+ (fetch global)

(async ()=>{
  try{
    const base = process.env.API_BASE || 'http://localhost:4001'

    // Login
    const loginResp = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    })
    if(!loginResp.ok){
      const t = await loginResp.text()
      throw new Error(`Login failed: ${loginResp.status} ${t}`)
    }
    const loginJson = await loginResp.json()
    console.log('--- LOGIN OK ---')
    console.log(JSON.stringify(loginJson, null, 2))

    const token = loginJson.token
    const headers = { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' }

    // Summary
    const sumResp = await fetch(`${base}/reports/summary`, { headers })
    const sumJson = await sumResp.json()
    console.log('--- SUMMARY ---')
    console.log(JSON.stringify(sumJson, null, 2))

    // Create transaction
    const payload = { type: 'expense', amount: 9.99, category: 'Automated Test', date: new Date().toISOString().slice(0,10), note: 'Automated test transaction' }
    const createResp = await fetch(`${base}/transactions`, { method: 'POST', headers, body: JSON.stringify(payload) })
    const createJson = await createResp.json()
    console.log('--- CREATED ---')
    console.log(JSON.stringify(createJson, null, 2))

    // List transactions (limit output)
    const listResp = await fetch(`${base}/transactions`, { headers })
    const listJson = await listResp.json()
    console.log('--- LIST (first 10) ---')
    console.log(JSON.stringify((Array.isArray(listJson) ? listJson.slice(0,10) : listJson), null, 2))

    console.log('--- TEST FINISHED ---')
    process.exit(0)
  }catch(err){
    console.error('--- TEST ERROR ---')
    console.error(err)
    process.exit(1)
  }
})()
