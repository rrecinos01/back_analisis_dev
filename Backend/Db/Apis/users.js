import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
const router = express.Router();


router.post('/create_users', async (req, res) => {
    try {
      /* 
      const nombre = 'Ronal Recinos';
      const email = 'admin@gmail.com';
      const contrasena = '1234'; // La contraseña sin encriptar */
      const { Correo, Password,Nombre, role_id } = req.body;
  
      // Generar un hash seguro de la contraseña
      const hashedPassword = await bcrypt.hash(Password, 10); // 10 es el número de rondas de hashing
  
      // Insertar el usuario en la base de datos con la contraseña hasheada
      const [result] = await pool.query('INSERT INTO users(nombre, email, contrasena, role_id) VALUES (?, ?, ?, ?)', [Nombre, Correo, hashedPassword, role_id]);
  
      res.json({ success: true, message: 'Usuario insertado correctamente' });
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      res.status(500).json({ success: false, message: 'Error al insertar usuario' });
    }
  });
  router.put('/update_users/:id', async (req, res) => {
    const userId = req.params.id; // Obtén el ID del usuario a actualizar de los parámetros de la URL
    const { email, contrasena, nombre, role_id } = req.body;
  
    try {
      // Si deseas actualizar la contraseña, primero genera un nuevo hash seguro
      let hashedPassword = contrasena; // Si no se proporciona una nueva contraseña, mantén la anterior
      if (contrasena) {
        hashedPassword = await bcrypt.hash(contrasena, 10); // Genera el nuevo hash seguro
      }
  
      // Realiza la actualización en la base de datos
      const [result] = await pool.query('UPDATE users SET nombre = ?, email = ?, contrasena = ?, role_id = ? WHERE id = ?', [nombre, email, hashedPassword, role_id, userId]);
  
      res.json({ success: true, message: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
    }
  });
  
  router.get('/users', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vista_usuarios');
      res.json({ success: true, users: rows });
    } catch (error) {
      console.error('Error al consultar usuarios:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
  });

  router.delete('/delete_users/:id', async (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario a eliminar de los parámetros de la URL
  
    try {
      // Realiza la eliminación en la base de datos
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
  
      if (result.affectedRows === 1) {
        // Si se eliminó con éxito una fila en la base de datos, significa que el usuario se eliminó correctamente
        res.json({ success: true, message: 'Usuario eliminado correctamente' });
      } else {
        // Si no se encontró un usuario con el ID especificado, responde con un mensaje de error
        res.status(404).json({ success: false, message: 'El usuario no existe' });
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
  });

export default router;
