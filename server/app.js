const express = require('express')
require('dotenv').config()
const path = require('path')
const app = express()

const PORT = process.env.PORT || 3000

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})