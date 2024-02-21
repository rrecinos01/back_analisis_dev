import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, contrasena } = req.body;
  
    try {
      // Obtener el hash de la contraseña almacenado en la base de datos para el usuario con el correo electrónico proporcionado
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
      // Verificar si se encontró un usuario con el correo electrónico proporcionado
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Correo electrónico o contraseña incorrectos' });
      }
  
      // Comparar la contraseña ingresada con el hash almacenado en la base de datos
      const match = await bcrypt.compare(contrasena, rows[0].contrasena);
  
      // Verificar si la contraseña coincide
      if (!match) {
        return res.status(401).json({ success: false, message: 'Correo electrónico o contraseña incorrectos' });
      }
  
      // La contraseña es correcta, puedes iniciar sesión aquí
      // Actualiza el valor de login_on a true
      await pool.query('UPDATE users SET login_on = true WHERE id = ?', [rows[0].id]);
  
      // Prepara la información del usuario a enviar al cliente
      const userInfo = {
        id: rows[0].id,
        nombre: rows[0].nombre,
        email: rows[0].email,
        role_id: rows[0].role_id,
        login_on: rows[0].login_on
      };
  
      // Envía una respuesta JSON con la información del usuario
      return res.json({ success: true, message: 'Inicio de sesión exitoso', user: userInfo });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    }
  });
  router.post('/logout', async (req, res) => {
    const { userId } = req.body; // Obtén el ID del usuario desde el cuerpo de la solicitud
  
    try {
      // Actualiza el valor de login_on a false para el usuario con el ID proporcionado
      await pool.query('UPDATE users SET login_on = false WHERE id = ?', [userId]);
  
      // Envía una respuesta exitosa
      res.json({ success: true, message: 'Cierre de sesión exitoso' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
  });

export default router;
