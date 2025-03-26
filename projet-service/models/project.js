const mongoose=require('mongoose');
const ProjetSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    dateD:{type:Date,required:true},
    dateF:{type:Date,required:true},
    status:{type:String,required:true},
    category: { type: String, required: true }
});
module.exports=mongoose.model('Projet',ProjetSchema);