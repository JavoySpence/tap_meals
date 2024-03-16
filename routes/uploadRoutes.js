import express from 'express';
import fs from 'fs';
// import multer from 'multer';
import fileUpload from 'express-fileupload';
import { getRandomHexValues } from './utils.js';
import path from 'path';
import paginate from 'express-paginate';
import { getAllMeals, addMeal} from '../data/database.js'; 

export const uploadRoutes = express.Router();



uploadRoutes.use(
    fileUpload({
        limits: {
            fileSize: 2 * 1024 * 1024, 
        },
        abortOnLimit: true,
    })
);




uploadRoutes.post('/newMeal', async (req, res) => {
    try {
        const newEntry = {};
        const id = req.body.id;
        let vFile = '';

        if (req.files && req.files.image) {
            const uploadedFile = req.files.image;
            const fileName = `${getRandomHexValues(8)}_${uploadedFile.name}`;
            const uploadPath = './uploads/' + fileName;

        
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads');
            }

            
            uploadedFile.mv(uploadPath, (err) => {
                if (err) {
                    throw err; 
                }
            });

            vFile = fileName;
        } else {
            vFile = 'default-avatar.png';
        }

        newEntry.meal_name = req.body.meal_name;
        newEntry.image = vFile;
    

        const result = await addMeal(newEntry);

        res.redirect('/meals_list');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



uploadRoutes.get('/meals_list', async (req, res) => {
    const data = await getAllMeals();
    res.render('meals/meals_list', {data})
});


uploadRoutes.get('/mealsInputs', async (req, res) => {
    
        res.render('meals/mealsInputs');
    
});







