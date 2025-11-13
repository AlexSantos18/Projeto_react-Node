(async ()=>{
  try{
    const res = await fetch('http://localhost:4001/debug/db')
    const data = await res.json()
    console.log('status', res.status)
    console.log(JSON.stringify(data, null, 2))
    process.exit(0)
  }catch(e){
    console.error('error', e.message)
    process.exit(1)
  }
})()
