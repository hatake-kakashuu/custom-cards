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

const normalizeTier = (tier) => {
  return tier.replace(/tier|\s|t/gi, '').toUpperCase()
}

app.post("/create", (req, res) => {
  const cards = JSON.parse(fs.readFileSync(DB_FILE))

  const newCard = {
    id: Date.now(),
    name: req.body.name.trim(),
    image: req.body.image.trim(),
    description: req.body.description.trim(),
    tier: normalizeTier(req.body.tier.trim()),
    creators: req.body.creators.trim()
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

app.delete("/delete/:id", (req, res) => {
  let cards = JSON.parse(fs.readFileSync(DB_FILE))
  const id = parseInt(req.params.id)

  const index = cards.findIndex(c => c.id === id)

  if (index === -1) {
    return res.status(404).json({ error: "Card not found" })
  }

  cards.splice(index, 1)

  fs.writeFileSync(DB_FILE, JSON.stringify(cards, null, 2))

  res.json({ message: `Card ${id} deleted successfully` })
})

app.listen(PORT, () => console.log("Server running on " + PORT))
