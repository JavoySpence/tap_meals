import express  from 'express';
import session from 'express-session';
import { getAllContacts, newContact, deleteContact , singleContact, updateContact } from '../data/database.js';

export const contactRoutes = express.Router();

let loggedin = false;


contactRoutes.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
      maxAge: 60000 * 2,
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


contactRoutes.get('/contactPage',  async (req, res) => {
  try {
      const data = await getAllContacts();
      res.render('contacts/contact', { data });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


contactRoutes.get('/contactsList', async (req, res) => {
    const contactList = await getAllContacts();
    res.render('contacts/contacts_list', {data: contactList})
});

contactRoutes.get('/contactInputs', async (req, res) => {
    res.render('contacts/contacts_inputs')
});


contactRoutes.post('/newContact', async (req, res) => {
 try{
   const newEntry = new Object();
   newEntry.location = req.body.location
   newEntry.address = req.body.address

   const result = await newContact(newEntry);
   res.redirect('/contactsList')
 } catch (error) {
    console.log(error)
 }
});


contactRoutes.get('/delete/:id', async (req, res) => {
    const id = req.params.id ;
    const result = await deleteContact(id);
    res.redirect('/contactsList')
});

contactRoutes.get('/editContact/:id', async (req, res) => {
  const id = req.params.id;
  const oneContact = await singleContact(id);
  
  console.log(oneContact)
  res.render('contacts/edit_contact', { data: oneContact });
});


contactRoutes.get('/viewContact/:id', async (req, res) => {
  const id = req.params.id;
  const oneContact = await singleContact(id);
  
  res.render('contacts/view_contacts', { data: oneContact });
})


contactRoutes.post('/updateContact', async (req, res) => {
  try{
  const newEntry = new Object();
  newEntry.id = req.body.id
  newEntry.location = req.body.location
  newEntry.address = req.body.address
  
  const result = await updateContact(newEntry);
  console.log(result)
  res.redirect('/contactsList')
  } catch (error) {
    console.log(error)
  }

})





// contactRoutes.get('/deleteContact/:id', async ())



