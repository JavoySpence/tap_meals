import ejs from 'ejs';
import express from 'express';
import morgan from 'morgan';
import path from 'path';



const  app = express();
const PORT = 3013;

import {mealRoutes} from './routes/mealRoutes.js';

app.set('view engine', 'ejs');

app.use(express.json({limit: '1kb'}))
app.use(express.urlencoded({extended: true, limit: '1kb'}));
app.use('/public', express.static('public'));

app.use(morgan('dev'));

app.use('/', mealRoutes);
// app.use('/', homeRoutes);

app.use('/', express.static('public'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
}); 



