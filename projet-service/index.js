const express=require('express');
const mongoose=require('mongoose');
const projectRoutes = require('./routes/projet');
require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const app=express();
app.use(express.json());


const port = process.env.PORT;
const host = process.env.HOST;

//connect to database
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))


app.use('/projet',projectRoutes);

//lancer le serveur
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});