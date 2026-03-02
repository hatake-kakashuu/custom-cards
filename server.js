import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on " + PORT))
