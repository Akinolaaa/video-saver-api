require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connectDB')
const express = require('express');
const expressFileUpload = require('express-fileupload');
const cors = require('cors');
const videoRouter = require('./video');
const cloudinary = require('cloudinary').v2
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET, 
});

const app = express();

app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(express.json())
app.use(expressFileUpload({ useTempFiles: true }));

// app.get('/', (req, res) => {
//   res.send('<h1> Video saver works </h1>')
// });

app.use('/api/videos', videoRouter)

app.use('*', (req, res) => {
  res.send('route does not exist')
})

app.use((err, req, res, next) => {
  if (err.message){
    return res.status(500).json({error: err.message})
  }
  return res.status(500).json({error:'something wrong has happened'})
})

const PORT = process.env.PORT || 5000;
const start = async() => {
  try{
    await connectDB(process.env.DB_URI);
    app.listen(PORT, () =>  console.log(`cooking on pot ${PORT}`));
  } catch(err) {
    console.log('server can\'t start', err)
  }
}

start()
