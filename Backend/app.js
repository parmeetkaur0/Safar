const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoute = require('./routes/maps.routes');
const rideRoute = require('./routes/ride.routes');

connectToDb();

const allowedOrigins = [
  "http://localhost:3000",
  "https://safar-2kyr.onrender.com"
];

app.use(cors());
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // if you’re using cookies or auth headers
  }));
app.options('*', cors()); // for preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoute);
app.use('/rides', rideRoute);



module.exports = app;

