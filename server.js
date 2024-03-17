import ejs from 'ejs';
import express from 'express';
import morgan from 'morgan';
import paginate from 'express-paginate';
import path from 'path';


const  app = express();
const PORT = 3013;

import {mealRoutes} from './routes/mealRoutes.js';
import { contactRoutes } from './routes/contactRoutes.js';
import { authRoutes } from './routes/auth.js';
import {uploadRoutes} from './routes/uploadRoutes.js';
import { adminRoutes } from './routes/admin.js'; 


app.set('view engine', 'ejs');

app.use(express.json({limit: '1kb'}))
app.use(express.urlencoded({extended: true, limit: '1kb'}));
app.use('/public', express.static('public'));




app.use(morgan('dev'));

app.use('/', mealRoutes);
app.use('/', contactRoutes);
app.use('/', authRoutes);
app.use('/', uploadRoutes);
app.use('/', adminRoutes);


app.use('/', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
}); 



