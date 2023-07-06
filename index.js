const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Uncomment the following lines if you are using MongoDB and have a "users" collection.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/users",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const newUser = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    password_confirmation: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Password does not match."
        }
    }
});
const User = mongoose.model("User", newUser);

// Route to handle the root URL
app.get("/", (req, res) => {
    res.send("About to master express");
});

// Route to handle user registration
app.post("/api/register", (req, res) => {
    const { name, email, password, password_confirmation } = req.body;

    const newUser = new User({
        name,
        email,
        password,
        password_confirmation
    })

    newUser.save()
    .then(() => {
        console.log("User saved to database");
        res.json("Form submitted successfully!!");
    })
    .catch((error) => {
        console.error("Error saving user to database", error);
        res.status(500).json("An error occurred");
    });

});

app.get("/api/customers", (req, res)=>{
    User.find()
    .then((users)=>{
        console.log(users)
        res.json(users)
        
    })
    .catch((err)=>{
        console.error("Error retrieving users", err)
        res.status(500).json({error: "An error occurred"})
    })
})

app.post("/api/login", (req, res)=>{
    const {email, password} = req.body
    
    User.findOne({email, password})
     .then((user)=>{
        if(user){
            res.json({message: "Available"})
        }else{
            res.status(401).json({ message:"Invalid credentials" }) 
        }
     }) 
     .catch((error)=>{
        console.error('Login failed', error )
        res.status(500).json({error: "An error occurred"})
     })
          
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
