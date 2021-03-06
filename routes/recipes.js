var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientsSchema = new Schema({
    ingredient: String
});

const recipesSchema = new Schema({
    apiID: String,
    name: String,
    ingredients: [ingredientsSchema]
})

// const usersSchema = new Schema({
//     name: String,
//     email: String,
//     phone: String,
//     likes: [likesSchema]
//   });

recipesModel = mongoose.model('recipes', recipesSchema);

router.get("/", async function (req, res) {
    console.log('route is beign hit')
    try { //recipesmodel.find finds everything in the recipes table 
        let myrecipes = await recipesModel.find({});
        res.render('list.ejs', {myrecipes:myrecipes})
    } catch (error) {
        console.log("error=" + error)
        res.send('there was an error')
    }
})

router.get('/form', function (req, res) {
    res.render('recipes.ejs')
})

router.post('/add', function (req, res) {
    let incoming_recipe = req.body.recipe_name
    // let incoming_ingredient = req.body.ingredients
    let obj = {
        "name": req.body.recipe_name,
        // "ingredient": req.body.ingredients
    }
    recipesModel.create(obj)
    res.send("thanks for adding " + incoming_recipe)
    res.render("add in ingredients" + "ingredients.ejs")
})

router.get("/:id", async function (req, res) {
    let stuff_from_database = await recipesModel.findById(req.params.id)
    res.render('details.ejs', {stuff_from_database:stuff_from_database})
})

router.post('/addingredient', async function (req, res) {
    console.log(req.body.ingredient_name)
    console.log(req.body.id)
    let row_in_recipes_table = await recipesModel.findById(req.body.id)
    let ingredients_obj = {
        ingredient: req.body.ingredient_name
    }
    row_in_recipes_table.ingredients.push(ingredients_obj) // put "beef patty" in ingredients[] array for "burger" or example
    let save = await row_in_recipes_table.save()
    res.send("thank you for submitting the ingredient")
})

router.post("/add_recipe_form", async function (req, res) {
    console.log(req.body.recipe_name)
    console.log(req.body.ingredients)
    console.log(req.body.name)
    try {
        let row_in_recipes_table = await recipesModel.findById(req.body.ingredients)
        let recipes_obj = {
            apiID: "",
            name: "",
        }
        row_in_recipes_table.contacts.push(recipes_obj) // put "recipe" in contacts[] array
        let save = await row_in_recipes_table.save()
    } catch (error) {
        console.log("error=" + error)
    }

    res.send("thank you for adding recipe")
});

router.post('/search', async function (req, res) {
        let requestedRecipe = await recipesModel.findOne({ name: req.body.recipe_find })
        console.log(req.body.recipe_find)
        console.log(requestedRecipe)
        res.render('requestedrecipe.ejs', {requestedRecipe})
})

module.exports = router;

