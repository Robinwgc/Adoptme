import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import hbs from 'hbs';  // 🆕 HANDLEBARS

dotenv.config();

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

// 🆕 CONFIGURAR HANDLEBARS
app.set('view engine', 'hbs');
app.set('views', './src/views');

const connection = mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));  // 🆕 Para CSS/JS estáticos

// 🆕 TUS RUTAS API (sin cambios)
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

// 🆕 VISTAS HANDLEBARS - NUEVAS RUTAS
app.get('/', async (req, res) => {
    res.render('index');
});

app.get('/users', async (req, res) => {
    try {
        const User = mongoose.model('User') || mongoose.models.User;
        const users = await User.find().select('email createdAt').lean();
        res.render('users', { users });
    } catch (error) {
        console.error('Error loading users:', error);
        res.render('users', { users: [], error: 'No se pudieron cargar los usuarios' });
    }
});

app.get('/pets', async (req, res) => {
    try {
        const Pet = mongoose.model('Pet') || mongoose.models.Pet;
        const pets = await Pet.find().select('name rarity owner').lean();
        res.render('pets', { pets });
    } catch (error) {
        console.error('Error loading pets:', error);
        res.render('pets', { pets: [], error: 'No se pudieron cargar las mascotas' });
    }
});

connection.then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});
