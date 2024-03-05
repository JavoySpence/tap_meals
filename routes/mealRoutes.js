import express from 'express';

export const mealRoutes = express.Router();


mealRoutes.get('/homePage', async (req, res) => {
    res.render('homepage')
});

mealRoutes.get('/about', async (req, res) => {
    res.render('about')
});
