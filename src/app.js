const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Room = require("../model/room");
const User = require("../model/user");
const Review = require("../model/review");
// const bcrypt = require("bcrypt");
// const methodOverload = require("method-overload");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//public static page path
const staticPagePath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");

// app.use(methodOverload("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:"secretCode",
  resave: false, 
  saveUninitialized: false
}));
app.use(express.static(staticPagePath)); //middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", templatePath);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//db conection
const DB = "mongodb+srv://campground:1234camp@cluster0.nlnxf9j.mongodb.net/oyo";
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(con =>{
    console.log("DB connection successful");
}).catch(e=>{
    console.log(e)
    });

// Middlewares---------------------------------------
const isLoggedIn = async (req,res,next)=>{
  if(!req.session.user){
    req.flash("error", "You need to login in first");
    return res.redirect("/login");
  }
  next();
}

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.session.user || null;
  next();
})

//Routings..........................................
app.get("/", async (req,res)=>{
  const roomsFeatured = await Room.find({category: "featured"});
  const roomsAffordable = await Room.find({category: "affordable"});
  res.status(200).render("index",{
    roomsFeatured,
    roomsAffordable,
    // message: req.flash("error")
  });
});

app.get("/admin", (req,res)=>{
  res.status(200).render("admin");
});

app.post("/admin", async (req,res)=>{
  const room = await Room.create(req.body);
  res.redirect("/");
});

app.get("/pg-girls",(req,res)=>{
  res.render("pg-girls")
});


app.get("/register", (req,res)=>{
  res.render("register");
});

app.post("/register", async (req,res)=>{
  // const {username, password} = req.body;
  // const hash = await bcrypt.hash(password, 12);
  const user = new User(req.body);
  await user.save();
  req.session.user = user;
  req.flash("success", `Logged in... Welcome: ${user.username}`);
  res.redirect("/");
});

app.get("/login", (req,res)=>{
  res.render("login");
});

app.post("/login", async (req,res)=>{
  const {username, password} = req.body;
  const user = await User.findOne({username});
  // const validPassword = await bcrypt.compare(password, user.password);
  if(password === user.password){
    req.session.user = user;
    req.flash("success", `Logged in. Welcome:${user.username}`);
    res.redirect("/");
  }else{
    res.send("Username/Password incorrect");
  }
});

app.post("/logout", (req,res)=>{
  req.logout(function(err){
    if(err) return next(err);
    req.flash("success", "Logged Out!");
    res.redirect("/");
})});

app.get("/:username/profile",isLoggedIn, async (req,res)=>{
  const {username} = req.params;
  const user = await User.findOne({username});
  res.render("user", {
    user
  })
})

app.get("/:id",isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    // console.log(req.session.user);
    if( !mongoose.Types.ObjectId.isValid(id) ){
      req.flash("error", "Room not found");
      return res.redirect("/");
    }
    const room = await Room.findById(id);
    res.render("room",{
      room
    });
});

app.post("/:roomId/review",isLoggedIn, async (req,res)=>{
  const {roomId} = req.params;
  const review = await Review.create(req.body);
  const room = await Room.findById(roomId);
  room.reviews.push(req.body);
  await room.save();
  req.flash("success", "Successfully made a review");
  res.redirect(`/${roomId}`);
})

app.post("/:userId/:roomId/book",isLoggedIn, async (req,res)=>{
  const {userId, roomId} = req.params;
  const room = await Room.findById(roomId);
  const user = await User.findOne({_id: userId});
  const {name, location,image,price} = room;
  const {enter, exit, guest} = req.body;
  user.booked.push({name, location, image, price, enter, exit, guest});
  user.save();
  console.log(user);
  req.flash("success", "Successfullybooked a room");
  res.redirect(`/${roomId}`); 
});

app.post("/:roomId/:reviewId", async (req,res) =>{
  res.send("For this code not written");
  // const { roomId ,reviewId } = req.params;
  // const room = await Room.findById(roomId);
  // console.log(room.reviews);
  // const index = room.reviews.indexOf()
  // res.send(room.reviews);
})


app.get("*", (req, res) => {
  res.send("Page not found");
});

app.listen(port, () => {
  console.log(`Listening in PORT ${port}`);
});
