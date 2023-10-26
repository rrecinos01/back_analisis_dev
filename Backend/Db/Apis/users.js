import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Ruta para obtener información de un usuario por su ID
router.get('/get_user/:id', async (req, res) => {
  const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la URL

  try {
    // Realiza una consulta en la base de datos para obtener la información del usuario por su ID
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (rows.length === 1) {
      // Si se encontró un usuario con el ID especificado, responde con la información del usuario
      res.json({ success: true, user: rows[0] });
    } else {
      // Si no se encontró un usuario con el ID especificado, responde con un mensaje de error
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener la información del usuario' });
  }
});

// Ruta para crear un usuario
router.post('/create_users', async (req, res) => {
  try {
    const { Correo, Password, Nombre, role_id } = req.body;

    // Generar un hash seguro de la contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insertar el usuario en la base de datos con la contraseña hasheada
    const [result] = await pool.query('INSERT INTO users(nombre, email, contrasena, role_id) VALUES (?, ?, ?, ?)', [Nombre, Correo, hashedPassword, role_id]);

    res.json({ success: true, message: 'Usuario insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al insertar usuario' });
  }
});

// Ruta para actualizar un usuario por su ID
router.put('/update_users/:id', async (req, res) => {
  const userId = req.params.id;

  // Obtiene los valores del cuerpo de la solicitud
  const { Correo, Password, Nombre, role_id } = req.body;

  try {
    // Define una lista de campos que se van a actualizar
    const fieldsToUpdate = [];
    const fieldValues = [];

    // Verifica si se proporcionó cada campo y agrégalo a la lista de campos a actualizar
    if (Correo !== undefined) {
      fieldsToUpdate.push('email = ?');
      fieldValues.push(Correo);
    }
    if (Password !== undefined) {
      // Si se proporciona una nueva contraseña, genera un nuevo hash seguro
      const hashedPassword = await bcrypt.hash(Password, 10);
      fieldsToUpdate.push('contrasena = ?');
      fieldValues.push(hashedPassword);
    }
    if (Nombre !== undefined) {
      fieldsToUpdate.push('nombre = ?');
      fieldValues.push(Nombre);
    }
    if (role_id !== undefined) {
      fieldsToUpdate.push('role_id = ?');
      fieldValues.push(role_id);
    }

    if (fieldsToUpdate.length === 0) {
      // Si no se proporcionaron campos para actualizar, no se ejecuta ninguna consulta
      return res.json({ success: true, message: 'Nada que actualizar' });
    }

    // Realiza la actualización en la base de datos con los campos actualizables
    const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    const values = [...fieldValues, userId];

    const [result] = await pool.query(query, values);

    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
});

// Ruta para obtener la lista de usuarios
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vista_usuarios');
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});
router.get('/roles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    res.json({ success: true, roles: rows });
  } catch (error) {
    console.error('Error al consultar roles:', error);
    res.status(500).json({ success: false, message: 'Error al consultar roles' });
  }
});

// Ruta para eliminar un usuario por su ID
router.delete('/delete_users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 1) {
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ success: false, message: 'El usuario no existe' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
});

export default router;
