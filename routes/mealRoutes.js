import express from 'express';
import session from 'express-session';


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

mealRoutes.get('/mealRoutes', async (req, res) => {
    res.render('meals/meals_page')
});




