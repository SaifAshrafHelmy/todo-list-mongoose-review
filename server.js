require("dotenv").config()

const express = require("express")
const app = express()
const db = require("./dbconfig")
const User = require("./models/user")
const bcrypt = require("bcrypt")
const Task = require("./models/task")
const mongoose = require("mongoose")

app.use(express.json())




app.get("/", async (req, res) => {

  res.json({ message: "You're home." })
})

app.post("/task", async (req, res) => {
  let username = "saif";
  let currentUser = await User.findOne({ username })

  let { content } = req.body;
  if (content) {
    try {
      // const newTask = new Task({content, owner:currentUser._id})
      // const savedTask = await newTask.save()
      const savedTask = await Task.create({ content, owner: currentUser._id });

      return res.json({ savedTask })
    } catch (error) {
      console.log(error);
      return res.json({ message: "Sorry, something went wrong." })
    }
  } else {
    res.json({ message: "Please enter task content." })
  }

})

app.get("/tasks", async(req,res)=>{
  let username = "saif";
  let currentUser = await User.findOne({ username })

  try {  
  let tasks = await Task.find({owner:currentUser._id}).populate({path:'owner',select:'username'})
  
  res.json({tasks})
  } catch (error) {
    res.json({error})
  }
})
// app.post("/task", async (req, res) => {
//   let username = "saif";
//   let { content } = req.body;
//   if (content) {
//     try {
//       const newTask = new Task({content})
//       const savedTask = await newTask.save()
//       console.log(savedTask._id)
//       let currentUser = await User.findOneAndUpdate({ username }, { $push: { tasks: savedTask.id } })
//       return res.json({ savedTask })
//     } catch (error) {
//       console.log(error);
//       return res.json({ message: "Sorry, something went wrong." })
//     }
//   } else {
//     res.json({ message: "Please enter task content." })
//   }

// })

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 12)
  let registeredUser;

  try {
    const newUser = new User({
      username,
      email,
      hash
    })

    registeredUser = await newUser.save()
  } catch (error) {
    console.log(error)
    return res.json({ message: "Sorry, something went wrong." })

  }

  res.json({ message: "Successfully registered.", registeredUser })

})

app.post("/login", async (req, res) => {
  let { username, email, password } = req.body;
  username = username.toLowerCase()
  let potentialUser;
  try {

    potentialUser = await User.findOne({ username });
    if (potentialUser) {
      const isRightPassword = await bcrypt.compare(password, potentialUser.hash)
      if (isRightPassword) {
        potentialUser = await User.findOne({ username }).populate('tasks');
        return res.json({ message: "Successfully logged in.", potentialUser })
      } else {
        return res.json({ message: "Wrong password." })
      }


    } else {
      return res.json({ message: "User not found." })
    }
  } catch (error) {
    console.log(error)
  }




})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`express app is listening on http://localhost:${port}`)
})