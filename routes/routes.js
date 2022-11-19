const express = require('express');
const database = require('..');
const Model = require('../models/userModel');

const router = express.Router()

module.exports = router;

//Post Method
router.post('/post', async(req, res) => {
    const data = new Model({
        nom: req.body.nom,
        age: req.body.age,
        adresse: req.body.adresse,
        status: req.body.status,
        prenom: req.body.prenom
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll',async (req, res) => {
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
router.get('/getById/:id',async (req, res) => {
    const data = await Model.findById(req.params.id);
    res.json(data)
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
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
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Le Document avec le nom ${data.prenom} ${data.nom} a été supprimé..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



