const express = require('express'); // require the express package
const server = express();
const cors = require('cors');
server.use(cors());
require('dotenv').config();
const axios = require('axios');
server.use(express.json())
const PORT=process.env.PORT;

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/cocktail', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

//create Schema
const drinksSchema = new mongoose.Schema({
    strDrink: String,
    strDrinkThumb:String,
  });

//create model

const drinkModel = mongoose.model('Drink', drinksSchema);




//http://localhost:3010/
server.get('/',homeHandler);


//http://localhost:3010/getAll
server.get('/getAll',getAllHandler)


//http://localhost:3010/addToFav
server.post('/addToFav',addToFavHandler)

//http://localhost:3010/getFav
server.get('/getFav',getFavHandler)

//http://localhost:3010/delete
server.delete('/delete',deleteHandler)

//http://localhost:3010/updateDrink
server.put('/updateDrink',updateDrinkHandler)




function homeHandler(req,res){
    res.send('401 exam test')
}


function getAllHandler(req,res){
    let url=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios.get(url).then((result)=>{
        res.send(result.data)
    })
}

function addToFavHandler (req,res){
    const {strDrink,strDrinkThumb}=req.body;

    const drink = new drinkModel({
        strDrink: strDrink,
        strDrinkThumb:strDrinkThumb,
    })
    drink.save();
    // console.log(req.body);
}

function getFavHandler (req,res){
    drinkModel.find({},(err,data)=>{
        res.send(data);
    })
}


function deleteHandler (req,res){
    const id=req.query.id;
    // console.log(id);
    drinkModel.deleteOne({_id:id},(err,data)=>{
        drinkModel.find({},(err,data)=>{
            res.send(data);
        })
    })

}

function updateDrinkHandler (req,res){
    const {strDrink,strDrinkThumb,id}=req.body;
    // console.log(strDrink,"---",id);
    drinkModel.findOne({_id:id},(err,data)=>{
        data.strDrink=strDrink;
        data.strDrinkThumb=strDrinkThumb,
        data.save().then(()=>{
            drinkModel.find({},(err,data)=>{
                res.send(data);
            })
        })
    })
}



server.listen(PORT,()=>{
    console.log(`listening on PORT: ${PORT}`);
})
