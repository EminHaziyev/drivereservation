const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
mongoose.connect("mongodb://127.0.0.1:27017/driveDB" , {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}))

const MongoDBSession = require("connect-mongodb-session")(session);

const store = new MongoDBSession({
    uri: "mongodb://127.0.0.1:27017/sessions",
    collection: "mySessions"
})

app.use(session({
    secret: "klj3haa4dfs9dklasdfj143210H3KSJDhasdfKALJSd832",
    resave: false,
    saveUninitialized: false,
    store: store
}));


const driverUserSchema = new mongoose.Schema({
    type: String,
    username: String,
    password: String,
    fullName: String,
    car: String,
    maxSeats: Number,
    drives: [{ type: mongoose.Schema.Types.ObjectId, ref: `Drive` }]
});
const Driver = new mongoose.model("Driver" , driverUserSchema);

const passengerUserSchema = {
    type: String,
    username: String,
    password: String,
    fullName: String,
    drives: [{ type: mongoose.Schema.Types.ObjectId, ref: `Drive` }]

};
const Passenger = new mongoose.model("Passenger" , passengerUserSchema);
const drivesSchema = {
    drive_id: String,
    whereFrom: String,
    whereTo: String,
    timeAndDate: String,
    completed: Boolean,
    cost: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: `Driver` },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: `Passenger` }]
};
const Drive = new mongoose.model("Drive" , drivesSchema);








const requireLogin = (req, res, next) => {
    if (req.session.userId) {
      // User is logged in
      next();
    } else {
      // User is not logged in, redirect to login page
      res.redirect("/login");
    }
  };
  


app.get("/signup", (req,res) => {
    res.render("signup");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.get("/drives", requireLogin, async (req,res) => {
    
    const foundDrives = await Drive.find()
    .populate('createdBy')
    .exec()
    .then(drives => {
        res.render("drives" , {foundDrives: drives});
    })
    .catch(err => {
        console.log(err);
    });

            

});


app.post("/driversignup" , async (req,res) => {
    const username = req.body.driverUsername;
    const password = req.body.driverPassword;
    const fullName = req.body.driverFullName;
    const carName = req.body.driverCarName;
    const seats = req.body.driverCarSeats;

    const newDriver = new Driver({
        type: "driver",
        username: username,
        password: password,
        fullName: fullName,
        car: carName,
        maxSeats: seats,
        drives: []

    });
    newDriver.save()
    .then(savedDriver => {
        req.session.userId = savedDriver._id;
        req.session.userType = savedDriver.type;
        res.redirect("/drives");
      })
      .catch(error => {
        console.error("Error saving passenger:", error);
        res.redirect("/signup");
      });
    
});

app.post("/passengersignup" , (req,res) => {
    const username = req.body.passengerUsername;
    const password = req.body.passengerPassword;
    const fullName = req.body.passengerFullName;

    const newPassenger = new Passenger({
        type: "passenger",
        username: username,
        password: password,
        fullName: fullName,
        drives: []
    });
    newPassenger.save()
    .then(savedPassanger => {
        req.session.userId = savedPassanger._id;
        req.session.userType = savedPassanger.type;
        res.redirect("/drives");
      })
      .catch(error => {
        console.error("Error saving passenger:", error);
        res.redirect("/signup");
      });
    
});


app.post("/loginuser" , async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const userData = await Driver.findOne({username: username});

    if(userData === null ){
        const userData1 = await Passenger.findOne({username: username});
        if(userData1 !== null){
            if(userData1.password === password){
                req.session.userId = userData._id;
                req.session.userType = userData.type;
                res.redirect("/drives");
            }else{
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
        
    }
    else{
        if(userData.password === password){
            req.session.userId = userData._id;
            req.session.userType = userData.type;
            res.redirect("/drives");
        }else{
            
            res.redirect("/login");
        }
    }
    
    


});







app.get("/dashboard" , requireLogin , async (req,res) => {
    if (req.session.userType === "driver"){
        const foundDrives = await Drive.find({createdBy: req.session.userId}).populate("passengers");
        console.log(foundDrives);
        foundDrives.forEach((drive) => {
            const passengers = drive.passengers;
            console.log(passengers); // Display the passengers array for each drive
        });
        res.render("dashboardd" , {foundDrives: foundDrives});
        
    }
    if(req.session.userType === "passenger"){
        const foundDrives = await Drive.find({ passengers: { $in: req.session.userId } }).populate("passengers").populate("createdBy");
        res.render("dashboardp" , {drives: foundDrives});
    }

    
});


app.post("/createDrive", (req,res) => {
    const from = req.body.from;
    const destination = req.body.destination;
    const time = req.body.time;
    const cost = req.body.cost;
    const id = "drive_0123456";
    const createdBy = req.session.userId;
    
    const newDrive = new Drive({
        drive_id: id,
        whereFrom: from,
        whereTo: destination,
        timeAndDate: time,
        completed: false,
        cost: cost,
        createdBy: createdBy,
        passengers: []

    });
    newDrive.save();
    res.redirect("/dashboard");


});

app.post("/createReservation" , requireLogin , async (req, res) => {
    const seats = parseInt(req.body.seats);
    const driveID = req.body.driveID;
    const foundDrive = await Drive.findOne({drive_id: driveID}).populate("createdBy").populate("passengers");
    
    const createdByDriverUsername = foundDrive.createdBy.username;
    const foundDriver = await Driver.findOne({username: createdByDriverUsername});
    
    const foundUser = await Passenger.findById(req.session.userId);


    foundDrive.passengers.push(foundUser._id);
    foundDrive.save();
    res.redirect("/dashboard")
        
    
    
})





app.listen(3000, () => {
    console.log("succes in 3000!");
})
