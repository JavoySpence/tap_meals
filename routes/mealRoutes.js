import express from 'express';
import session from 'express-session';
import { getAllMeals, deleteSingleMeal } from '../data/database.js';


export const mealRoutes = express.Router();

mealRoutes.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000 * 1,
    }
  }));
  
  const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        try {
            return res.redirect('/loginforms');
        } catch (error) {
            console.error('Error redirecting to login page:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
  };


mealRoutes.get('/homePage',  async (req, res) => {
    res.render('homepage')
});

mealRoutes.get('/about',  async (req, res) => {
    res.render('about')
});

mealRoutes.get('/mealPage', isAuthenticated, async (req, res) => {
    const mealsList = await getAllMeals()
    res.render('meals/meals_page',
    {
        data: mealsList
    })
});


mealRoutes.get('/deleteMeal/:id', async (req, res) => {
    try{
    const id = req.params.id;
    const result = await deleteSingleMeal(id);
    res.redirect('/meals_list');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})


// mealRoutes.get('/adminPage', async (req, res) => {
//     try {
//         const locationList = await getAllContacts();
//         // const mealsList = await getAllMeals();

//         res.render('meals/admin', {
//             data: locationList,
//             // mealsList: mealsList 
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });




