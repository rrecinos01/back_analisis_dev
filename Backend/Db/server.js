import express from 'express'
import {pool} from './db.js'
import bcrypt from 'bcrypt';
import cors from 'cors';
import session from 'express-session'
import {PORT} from './config.js'
import loginRoutes from './Apis/login.js'; 
import usersRoutes from './Apis/users.js';
import desembolsos from './Apis/desembolsos.js'; 

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', loginRoutes);
app.use('/', usersRoutes);
app.use('/', desembolsos);

app.get('/empleado', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleado');
    res.json({ success: true, empleado: rows });
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
