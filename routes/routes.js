const express = require('express');
const database = require('..');
const Model = require('../models/userModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const check = require("./middleware")

const router = express.Router()


module.exports = router;


// Handling post request
router.post("/login", async (req, res, next) => {
    
    let { email, password } = req.body;

    let existingUser;
 
    existingUser = await Model.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).send("email doesn't exist...!");
    }
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).send("password is invalid");
    }


    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      const error = new Error("Erreur! Quelque chose s'est mal passée.");
      return next(error);
    }
   
    res
      .status(200)
      .json({
        success: true,
        data: {
          userId: existingUser.id,
          email: existingUser.email,
          token: token,
        },
      });
});
   
  // Handling post request
router.post("/signup", async (req, res, next) => {
const { email, password, prenom, nom, age, status, adresse } = req.body;
const users = [];

const newUser = Model({
    email,
    password, 
    prenom, 
    nom, 
    age,
    status, 
    adresse

});

try {

    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;
    users.push(newUser);
    res.json(newUser);
    await newUser.save();

} catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
}
let token;
try {
    token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );
} catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
}
res
    .status(201)
    .json({
    success: true,
    data: { userId: newUser.id,
        email: newUser.email, token: token },
    });
});
  
router.get('/accessResource', (req, res)=>{
	const token = req.headers.authorization.split(' ')[1];
	//Authorization: 'Bearer TOKEN'
	if(!token)
	{
		res.status(200).json({success:false, message: "Error! Token was not provided."});
	}
	//Decoding the token
	const decodedToken = jwt.verify(token,"secretkeyappearshere" );
	res.status(200).json({
        success:true, 
        data:{
            userId:decodedToken.userId,
            email:decodedToken.email
        }
    });
})

//Post Method
router.post('/add', async(req, res) => {
    const users = [];

    const data = new Model({
        nom: req.body.nom,
        age: req.body.age,
        adresse: req.body.adresse,
        status: req.body.status,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password
    })

    try {
        const hash = await bcrypt.hash(data.password, 10);
        data.password = hash;
        users.push(data.password);
        res.json(data.password);
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll',check,async (req, res) => {
    try{
        // const data = await Model.find();
        // res.status(201).json(data)
        const data = await Model.find();
        res.json(data)
        // console.log(res.body)
                
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getById/:id',check,async (req, res) => {
    const data = await Model.findById(req.params.id);
    res.json(data)
})

//Update by ID Method
router.patch('/update/:id',check, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id',check, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Le Document avec le nom ${data.prenom} ${data.nom} a été supprimé..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



