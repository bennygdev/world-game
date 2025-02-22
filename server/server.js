const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require('./routes/auth');

const corsOptions = {
  origin: ['http://localhost:5173'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', authRoutes);

app.listen(8080, () => {
  console.log('Server started on port 8080');
});