import express from "express"
import fs from "fs"

const app = express()
app.use(express.json())
app.use(express.static("."))

const PORT = process.env.PORT || 3000
const DB_FILE = "cards.json"

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]))
}

app.post("/create", (req, res) => {
  const cards = JSON.parse(fs.readFileSync(DB_FILE))

  const newCard = {
    id: cards.length + 1,
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    tier: req.body.tier,
    creators: req.body.creators
  }

  cards.push(newCard)
  fs.writeFileSync(DB_FILE, JSON.stringify(cards, null, 2))

  res.json({ url: `/card${newCard.id}` })
})

app.get("/card:id", (req, res) => {
  const cards = JSON.parse(fs.readFileSync(DB_FILE))
  const card = cards.find(c => c.id == req.params.id)

  if (!card) return res.status(404).json({ error: "Card not found" })

  const { id, ...cardData } = card
  res.json(cardData)
})

app.listen(PORT, () => console.log("Server running on " + PORT))
