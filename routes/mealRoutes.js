import express from 'express';
import session from 'express-session';
import paginate from 'express-paginate';

import { getAllMeals, deleteSingleMeal, getTotalMealsCount,  getAllMeals2, getAllRoles } from '../data/database.js';


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
   const data = await getAllRoles()
    res.render('homepage', {data})
});

mealRoutes.get('/about',  async (req, res) => {
    res.render('about')
});


mealRoutes.get('/mealPage', paginate.middleware(6, 50), isAuthenticated, async (req, res) => {
  const limit = req.query.limit;
  const offset = req.skip; 
  
    const itemList = await getAllMeals(limit, offset);
    const itemCount = await getTotalMealsCount();

    const pageCount = Math.ceil(itemCount / limit)
  
    res.render('meals/meals_page', {
      data: itemList,
      pageCount: pageCount,
      itemCount: itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
})



mealRoutes.get('/deleteMeal/:id', async (req, res) => {
    try{
    const id = req.params.id;
    const result = await deleteSingleMeal(id);
    res.redirect('/meals_list');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});




 




