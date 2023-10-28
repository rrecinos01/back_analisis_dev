import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/empleado', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM empleado');
      res.json({ success: true, empleado: rows });
    } catch (error) {
      console.error('Error al consultar usuarios:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
});

router.get('/solicitudes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solicitudes');
    res.json({ success: true, solicitudes: rows });
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al consultar solicitudes' });
  }
});


router.post('/crear_empleado', async (req, res) => {
  try {
    // Obtiene los valores del cuerpo de la solicitud
    const {
      em_nombre,
      em_pri_apellido,
      em_seg_apellido,
      em_fecha_nac,
      em_pago_mens,
      em_dpi,
      em_direccion,
      em_fecha_ini,
      em_estado
    } = req.body;

    // Obtiene el valor máximo actual de idempleado en la tabla empleado
    const [maxIdResult] = await pool.query('SELECT MAX(idempleado) AS maxId FROM empleado');
    const maxId = maxIdResult[0].maxId || 0; // Si no hay registros, inicia en 0

    // Calcula el nuevo valor de idempleado sumando 1 al máximo actual
    const nuevoIdEmpleado = maxId + 1;

    // Realiza la inserción en la base de datos con el nuevo idempleado
    const query = `
      INSERT INTO empleado (idempleado, em_nombre, em_pri_apellido, em_seg_apellido, em_fecha_nac, em_pago_mens, em_dpi, em_direccion, em_fecha_ini, em_estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      nuevoIdEmpleado,
      em_nombre,
      em_pri_apellido,
      em_seg_apellido,
      em_fecha_nac,
      em_pago_mens,
      em_dpi,
      em_direccion,
      em_fecha_ini,
      em_estado
    ];

    const [result] = await pool.query(query, values);

    res.json({ success: true, message: 'Empleado insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar empleado:', error);
    res.status(500).json({ success: false, message: 'Error al insertar empleado' });
  }
});

router.post('/crear_fam_empleado', async (req, res) => {
  try {
    // Obtiene los valores del cuerpo de la solicitud
    const {
      empleado_idempleado,
      fa_nombre,
      fa_parentezco,
      fa_direccion,
      fa_lug_trabajo
    } = req.body;

    // Realiza la inserción en la base de datos
    const query = `
      INSERT INTO fam_empleado (empleado_idempleado, fa_nombre, fa_parentezco, fa_direccion, fa_lug_trabajo)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      empleado_idempleado,
      fa_nombre,
      fa_parentezco,
      fa_direccion,
      fa_lug_trabajo
    ];

    const [result] = await pool.query(query, values);

    res.json({ success: true, message: 'Familiar de empleado insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar familiar de empleado:', error);
    res.status(500).json({ success: false, message: 'Error al insertar familiar de empleado' });
  }
});

router.delete('/delete_empleado/:id', async (req, res) => {
  const idempleado = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM empleado WHERE idempleado = ?', [idempleado]);

    if (result.affectedRows === 1) {
      res.json({ success: true, message: 'Empleado eliminado correctamente' });
    } else {
      res.status(404).json({ success: false, message: 'El Empleado no existe' });
    }
  } catch (error) {
    console.error('Error al eliminar Empleado:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar Empleado' });
  }
});


router.put('/update_empleado/:id', async (req, res) => {
  const empleadoId = req.params.id;

  // Obtiene los valores del cuerpo de la solicitud
  const { em_nombre, em_pri_apellido, em_seg_apellido, em_fecha_nac, em_pago_mens, em_dpi, em_direccion, em_fecha_ini, em_estado } = req.body;

  try {
    // Define una lista de campos que se van a actualizar
    const fieldsToUpdate = [];
    const fieldValues = [];

    // Verifica si se proporcionó cada campo y agrégalo a la lista de campos a actualizar
    if (em_nombre !== undefined) {
      fieldsToUpdate.push('em_nombre = ?');
      fieldValues.push(em_nombre);
    }
    if (em_pri_apellido !== undefined) {
      fieldsToUpdate.push('em_pri_apellido = ?');
      fieldValues.push(em_pri_apellido);
    }
    if (em_seg_apellido !== undefined) {
      fieldsToUpdate.push('em_seg_apellido = ?');
      fieldValues.push(em_seg_apellido);
    }
    if (em_fecha_nac !== undefined) {
      fieldsToUpdate.push('em_fecha_nac = ?');
      fieldValues.push(em_fecha_nac);
    }
    if (em_pago_mens !== undefined) {
      fieldsToUpdate.push('em_pago_mens = ?');
      fieldValues.push(em_pago_mens);
    }
    if (em_dpi !== undefined) {
      fieldsToUpdate.push('em_dpi = ?');
      fieldValues.push(em_dpi);
    }
    if (em_direccion !== undefined) {
      fieldsToUpdate.push('em_direccion = ?');
      fieldValues.push(em_direccion);
    }
    if (em_fecha_ini !== undefined) {
      fieldsToUpdate.push('em_fecha_ini = ?');
      fieldValues.push(em_fecha_ini);
    }
    if (em_estado !== undefined) {
      fieldsToUpdate.push('em_estado = ?');
      fieldValues.push(em_estado);
    }

    if (fieldsToUpdate.length === 0) {
      // Si no se proporcionaron campos para actualizar, no se ejecuta ninguna consulta
      return res.json({ success: true, message: 'Nada que actualizar' });
    }

    // Realiza la actualización en la base de datos con los campos actualizables
    const query = `UPDATE empleado SET ${fieldsToUpdate.join(', ')} WHERE idempleado = ?`;
    const values = [...fieldValues, empleadoId];

    const [result] = await pool.query(query, values);

    res.json({ success: true, message: 'Empleado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar empleado' });
  }
});





export default router;
