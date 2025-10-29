const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Dummy routes
app.use('/users', require('./routes/users'));
app.use('/clothingItems', require('./routes/clothingItems'));
app.use('/outfits', require('./routes/outfits'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});