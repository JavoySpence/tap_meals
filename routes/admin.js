import express from 'express';
import session from 'express-session';
import paginate from 'express-paginate';
import { sendEmail } from '../utils/bookingEmail.js';


// Use the Email class here


import { getAllMeals2, getAllOrders, getTotalMealsCount, getAllContacts, newOrder, getSingleOrder,  deleteSingleOrder  } from '../data/database.js';

export const adminRoutes = express.Router();


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


adminRoutes.get('/adminPage',  paginate.middleware(6, 50), isAuthenticated, async (req, res) => {


       const limit = req.query.limit;
       const offset = req.skip; 

    
    
       const mealsList = await getAllMeals2(limit, offset);
       const itemCount = await getTotalMealsCount();

       const pageCount = Math.ceil(itemCount / limit)


       res.render('adminPages/admin', 
       {
        data: mealsList,
        pageCount: pageCount,
        itemCount: itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    
      }
       
       )
  });


  adminRoutes.get('/allOrders', async (req, res) => {
    const ordersList = await getAllOrders(); 
    res.render('adminPages/orders', {
      data: ordersList
    });
  });
  

  adminRoutes.get('/ordersInputs', async (req, res) => {
    const mealsList = await getAllMeals2()
    const contactList = await getAllContacts();
    const orderList = await getAllOrders();
    res.render('adminPages/ordersInputs', {
      mealsData: mealsList,
      data: orderList,
      locationsData: contactList
    });
  });


  adminRoutes.post('/newOrder', async (req, res) => {
    const newEntry = new Object();
    newEntry.meal_ordered = req.body.meal_ordered;
    newEntry.stud_fn = req.body.stud_fn;
    newEntry.stud_ln = req.body.stud_ln;
    newEntry.location = req.body.location;
    newEntry.email = req.body.email;
 
    await sendEmail(newEntry);
   const result = await newOrder(newEntry);
 
   res.redirect('/ordersInputs');
 
 });
 

 adminRoutes.get('/deleteOrder/:id', async (req, res) => {
  const id = req.params.id ;
  const data = await deleteSingleOrder(id);
  res.redirect('/allOrders')
 });







  


