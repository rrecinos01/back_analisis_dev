import express from 'express'
import {pool} from './db.js'
import bcrypt from 'bcrypt';
import cors from 'cors';
import session from 'express-session'
import {PORT} from './config.js'
const app = express();
app.use(express.json());
app.use(cors());

app.get('/roles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    res.json({ success: true, roles: rows });
  } catch (error) {
    console.error('Error al consultar roles:', error);
    res.status(500).json({ success: false, message: 'Error al consultar roles' });
  }
});

app.get('/get_user/:id', async (req, res) => {
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
app.post('/create_users', async (req, res) => {
  try {
    /* 
    const nombre = 'Ronal Recinos';
    const email = 'admin@gmail.com';
    const contrasena = '1234'; // La contraseña sin encriptar */
    const { Correo, Password,Nombre, role_id } = req.body;
    console.log(role_id)
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

app.put('/update_users/:id', async (req, res) => {
  console.log(req.body);
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


app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vista_usuarios');
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});
app.get('/empleado', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleado');
    res.json({ success: true, empleado: rows });
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});
app.delete('/delete_users/:id', async (req, res) => {
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
app.post('/login', async (req, res) => {
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
app.post('/logout', async (req, res) => {
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



app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
