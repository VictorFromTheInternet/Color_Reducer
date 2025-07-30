import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import colorReducerRouter from './routes/color_reducer_router.js'


const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 5000
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}



// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use(cors(corsOptions))

app.use('/color-reducer-api', colorReducerRouter)
app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})