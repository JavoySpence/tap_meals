import express  from 'express';
import bcrypt from 'bcrypt';
import {createUser, getAllUsers, getAllRoles, getAllContacts } from '../data/database.js';



export const authRoutes = express.Router();


authRoutes.get('/signupforms', async (req, res) => {
    const data = await getAllRoles();
    const locationsData = await getAllContacts();
    console.log(data)
    res.render('userAuths/signup', {data,locationsData})
});

authRoutes.get('/loginforms', async (req, res) => {
     const data = await getAllRoles()
     const locationsData = await getAllContacts()
    res.render('userAuths/login', {data, locationsData} )
});


authRoutes.get('/users', async (req, res) => {
    try {
        const users = await createUser();
        res.render('userAuths/loginList', { data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});


authRoutes.post('/signup', async (req, res) => {
    const newEntry = new Object();

    newEntry.first_name = req.body.first_name;
    newEntry.last_name = req.body.last_name;
    newEntry.location = req.body.location;
    newEntry.position = req.body.position;
    newEntry.password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(newEntry.password, 10);
        newEntry.password = hashedPassword;

        const userId = await createUser(newEntry);
        res.redirect('/homePage');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


authRoutes.post('/login', async (req, res) => {
    const { first_name, last_name, location, position, password } = req.body;

    try {
        const users = await getAllUsers();
        const user = users.find(u => u.first_name === first_name && u.last_name === last_name && u.location === location && u.position === position);

        if (!user) {
            return res.status(401).send('User not found or incorrect details provided');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).send('Wrong Password');
        }

        req.session.user = user;
        res.redirect('/mealPage?message=Login%20successful');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});


authRoutes.get('/deleteUser', async (req, res) => {
    const id = req.params.id ;
    const result = await deleteUser(id);
    res.redirect('/users')
});


authRoutes.get('/userList', async (req, res) => {
    const usersList = await getAllUsers();
    res.render('userAuths/usersList', { data: usersList });
});


authRoutes.get('/allRoles', async (req, res) => {
    const roles = await getAllRoles();
    res.render('userAuths/rolesList', { data: roles });
});


