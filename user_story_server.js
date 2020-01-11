//Following packages have been used, read respective documentation for more details.
var express = require("express");
var us = express(); //us stands for user-story
var mongoose = require("mongoose");
var cors = require("cors");// Used to establish sever-to-server communication,
// Here it is used to communicate between React Server and this Microservice Server, which is otherwise blocked.
var bodyParser = require("body-parser");// Used to parse queries from URLs.

us.use(bodyParser.urlencoded({ extended: true }));
us.use(bodyParser.json());
us.use(cors());

// Imports User_Story Schema from "user_story_schema.js"
var { User_Story } = require("./user_story_schema.js");

// Connects to MongoDB database,read MongoDB documentation on how to use below code.
mongoose.connect(
  "mongodb+srv://micro:qwerty123@cluster0-bmsv0.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

/*
Learn the difference between express.post,get,use etc.
Also get acquainted with the following operations in MongoDB: mongoose.find, findOne, deleteOne, Create etc.
These are used to perform CRUD operations in MongoDB
*/



//The below function is fired when /getuserstory route is hit.
us.post("/getuserstory", (req, res) => {
  //check for authentication
  let owner_id = req.body.owner;
  console.log("Ownwr     :"+owner_id)  // use log for debugging purposes as required
  // To see console in Chrome press Ctrl+Shift+I.
  User_Story.find({owner: owner_id}, (err, user_story_obj) => {  //Returns result of the query from the MongoDB.
    if (err) {
      console.log("error: " + JSON.stringify(err));
      res.send({status:true,error:err})
    } else {
      console.log(user_story_obj)
      res.json({user_stories:user_story_obj});// Used to return object containing the results to client.
    }
  });
});

// Retrieves only one object of the id mentioned
us.post("/retrieve_one", (req, res) => {
  let us_id = req.body.us_id;
  console.log("US Id : " + req.body.us_id)
  User_Story.findById(us_id, (err, one_us) => {
    if (err) {
      console.log("Erroe:" + err);
      res.send({status:false,error:err})
    } else {
      res.send({status:true,user_story:one_us});//See the difference between res.json and res.send
    }
  });
});

us.post("/removeuserstory", (req, res) => {
  let us_id = req.us_id;
  User_Story.deleteOne({ _id: us_id }, err => {
    if (err) {
      console.log("error: " + JSON.stringify(err));
      res.json({ status: "failure" });
    } else {
      res.json({ status: "success" });
    }
  });
});

us.post("/link_us",(req,res) =>{
    let us_id=req.body.us_id
    let micro_type=req.body.micro_type
    let micro_id=req.body.micro_id
    console.log("usid"+us_id)
    console.log("hi"+JSON.stringify(req.body))
    User_Story.find({_id:us_id},(err, obj) => {
      if(err)
        console.log(err)
      else  {
        console.log("ds"+JSON.stringify(obj))
      }
    })
    
    if(micro_type==="ms"){
      User_Story.update(
        {
          _id:us_id
        },
        {
          $push:{link_to_ms: micro_id},          
        },
        function (error, success) {
          if (error) {
              console.log("err"+error);
          } else {
              console.log("suc"+JSON.stringify(success));
          }
      }
      );
    }
    else{
      User_Story.update(
        {
          _id:us_id
        },
        {
          $push:{link_to_mf: micro_id},          
        },
        function (error, success) {
          if (error) {
              console.log(error);
          } else {
            console.log("suc"+JSON.stringify(success));
          }
      }
      );
    }
    
    User_Story.find({_id:us_id},(err, obj) => {
      if(err)
        console.log(err)
      else  {
        console.log(obj)
      }
    })
})

us.post("/adduserstory", (req, res) => {
  let title = req.body.title
  let desc = req.body.desc
  let priority = req.body.priority
  let status = req.body.status
  let owner = req.body.owner
  User_Story.create(
      { desc: desc, priority: priority, status: status, owner: owner, title:title },
      function(err, user_story) {
        if (err) {
          console.log(err);
          res.send({status:false, error:err})
        } else {
          user_story.owner = req.body.owner
          user_story.save()
          console.log(user_story);
          console.log("User Story saved successfully");
          res.send({status:true});
        }
      }
    );
});

us.post("/modifyuserstory", (req, res) => {
  User_Story.update(
    {
      _id: req.body.us_id
    },
    {
      title:req.body.title,
      desc: req.body.desc,
      priority: req.body.priority,
      status: req.body.status
    },
    function(err,us){
      if(err){
        console.log("Error "+err)
        res.send({status:false,error:err})
      }else {
        console.log("Updated user story")
        res.send({status:true})
      }
    }
  );
});

// Sample GET request
us.get("/insert_two", (req, res) => {
  User_Story.create({
    title:"Travel Book",
    priority:"hi",
    desc: "This is a US for flights. Also handles cheap airline ticket and check in baggage. Also handles ticket booking and payment for buses",
    status: "full done"
  }, (err,obj)=> {
    if(err){
      console.log(JSON.stringify(err))
    }
    else {
      console.log(obj);
      console.log("Obj saved successfully")
      res.json({})
    }
  })
});


// This server will run on localhost:5001 on local machine
// "process.env.PORT" will automatically detect the port to run when deployed on Heroku or any other Cloud
us.listen(process.env.PORT || 5001, () => {
  console.log("listening at port: 5001");
});
