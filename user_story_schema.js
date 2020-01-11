//Mongoose package used to create Schemas for MongoDB.
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creates Schema with required attributes and data types
var User_Story_Schema = new Schema({
  title: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  priority: { type: String, required: true, unique: false },
  status: { type: String, required: true, unique: false },
  owner: { type:String,required:true},
  link_to_ms:[{ type: String }],  //This attribute is an array which stores objects of type String.
  link_to_mf: [{ type: String }],
  progress: { type: Number, required: false, unique: false }
});

//User_Story object  will be used for exporting User_Story_Schema
const User_Story = mongoose.model("User_Story_Schema", User_Story_Schema);
// Below code used for exporting the Schemas
// Used when we need to import the below Schemas in another file.
module.exports = { User_Story: User_Story };
