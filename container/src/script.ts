import axios from "axios"

const TARGET = "your-endpoint"
const CONCURRENCY = 50 
const INTERVAL = 200   

let total = 0

const fireRequests = async () => {
  const promises = Array.from({ length: CONCURRENCY }, async () => {
    try {
      await axios.get(TARGET)
      total++
    } catch (err:any ) {
      console.error("Erro na request", err.message)
    }
  })

  await Promise.all(promises)
  console.log(`Total de requisições disparadas: ${total}`)
}

setInterval(fireRequests, INTERVAL)
