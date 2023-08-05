const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://monishkumar08:monish123@cluster0.tt0dzxb.mongodb.net/HiveTechTask?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// CRUD API routes
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  await newItem.save();
  res.json(newItem);
});

app.put('/api/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  item.name = req.body.name;
  item.description = req.body.description;

  await item.save();
  res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json({ message: 'Item deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
