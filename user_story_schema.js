var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var User_Story_Schema = new Schema({
  title: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  priority: { type: String, required: true, unique: false },
  status: { type: String, required: true, unique: false },
  //owner: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  owner: { type:String,required:true},
  link_to_ms:[{ type: String }],
  link_to_mf: [{ type: String }],
  progress: { type: Number, required: false, unique: false }
});

const User_Story = mongoose.model("User_Story_Schema", User_Story_Schema);

module.exports = { User_Story: User_Story };
