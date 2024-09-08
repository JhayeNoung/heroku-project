const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genre');
const validObjectId = require('../middlewares/validObjectId');
const auth = require('../middlewares/auth');

router.get('/', async (req,res)=>{
    const genres = await Genre.find();
    res.status(200).send(genres);
});

router.get('/:id', validObjectId, async (req,res)=>{
    // find by id and check 404
    const genres = await Genre.findById(req.params.id);
    if(!genres) return res.status(404).send('No genre with this id');

    res.status(200).send(genres);
});

router.post('/', auth, async (req, res)=>{
    // check 401 and 403

    // check validation 400
    let {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre(req.body);
    await genre.save();

    res.status(200).send(genre);
});

router.put('/:id', [validObjectId,auth], async (req, res)=>{
    // check valid id(400), check 401 and 403
    // validate genre check 400
    let {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check item 404
    let genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('No genre with this id');

    // update item
    genre.name = req.body.name;
    await genre.save();
    res.status(200).send('Genre has been updated');
})

router.delete('/:id', [validObjectId,auth], async (req, res)=>{
    // check valid id(400), check 401 and 403

    // check item 404
    let genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('No genre with this id');

    // update item
    await genre.deleteOne();
    res.status(200).send('Genre has been deleted');
})

module.exports = router;