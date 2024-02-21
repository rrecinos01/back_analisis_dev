import express from 'express'
import {pool} from './db.js'
import bcrypt from 'bcrypt';
import cors from 'cors';
import session from 'express-session'
import {PORT} from './config.js'
import loginRoutes from './Apis/login.js'; 
import usersRoutes from './Apis/users.js';
import desembolsos from './Apis/desembolsos.js'; 
import empleados from './Apis/empleados.js'; 
const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/', loginRoutes);
app.use('/', usersRoutes);
app.use('/', desembolsos);
app.use('/', empleados);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
