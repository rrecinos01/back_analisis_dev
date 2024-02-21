import express from 'express';
import { pool } from '../db.js';

const router = express.Router();
router.get('/empleado_list', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleado');
    res.json({ success: true, emple: rows });
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});

router.get('/list_aguinaldo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM aguinaldo');
    res.json({ success: true, agui: rows });
  } catch (error) {
    console.error('Error al consultar bono:', error);
    res.status(500).json({ success: false, message: 'Error al consultar bono' });
  }
});

router.get('/list_bono', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bono');
    res.json({ success: true, bono: rows });
  } catch (error) {
    console.error('Error al consultar bono:', error);
    res.status(500).json({ success: false, message: 'Error al consultar bono' });
  }
});

router.get('/list_iggs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM igss_cuotas');
    res.json({ success: true, iggs: rows });
  } catch (error) {
    console.error('Error al consultar bono:', error);
    res.status(500).json({ success: false, message: 'Error al consultar bono' });
  }
});

router.get('/list_empleado_entra_salida', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vista_ingreso_empleado');
    res.json({ success: true, h_e_s: rows });
  } catch (error) {
    console.error('Error al consultar Hora Ingreso:', error);
    res.status(500).json({ success: false, message: 'Error al consultar Hora ingreso' });
  }
});

router.get('/list_desembolsos', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM pago_nomina_ultimos_ingresos_mes_pasado');
      res.json({ success: true, list: rows });
    } catch (error) {
      console.error('Error al consultar usuarios:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
});

router.get('/calcular_quincena', async (req, res) => {
    try {
      const [rows] = await pool.query('call railway.sp_calcula_nomina_quincena();');
      res.json({ success: true});
    } catch (error) {
      console.error('Error al consultar quincena:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
});

router.get('/calcular_fin_mes', async (req, res) => {
    try {
      const [rows] = await pool.query('call railway.sp_calcula_nomina();');
      res.json({ success: true});
    } catch (error) {
      console.error('Error al consultar fin de mes:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
});

router.get('/calcular_bono', async (req, res) => {
  try {
    const [rows] = await pool.query('call railway.sp_calcula_bono();');
    res.json({ success: true});
  } catch (error) {
    console.error('Error al consultar Bono:', error);
    res.status(500).json({ success: false, message: 'Error al consultar' });
  }
});

router.get('/calcular_faguinaldo', async (req, res) => {
  try {
    const [rows] = await pool.query('call railway.sp_calcula_aguinaldo();');
    res.json({ success: true});
  } catch (error) {
    console.error('Error al consultar Aguinaldo', error);
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
});

router.post('/insertar_horas_extras', async (req, res) => {
  try {
    const { empleado_idempleado, ho_dia_festivo, ho_fecha, horas_extrascol } = req.body;
    console.log(req.body)
    // Insertar el usuario en la base de datos con la contraseña hasheada
    
    const [result] = await pool.query('INSERT INTO horas_extras(empleado_idempleado, ho_dia_festivo, ho_fecha, horas_extrascol) VALUES (?, ?, ?, ?)', [empleado_idempleado, ho_dia_festivo, ho_fecha, horas_extrascol ]);

    res.json({ success: true, message: 'Usuario Horas Insertadas correctamente' });
  } catch (error) {
    console.error('Error al insertar Horas:', error);
    res.status(500).json({ success: false, message: 'Error al insertar Horas' });
  }
});

router.post('/insertar_deuda_tienda', async (req, res) => {
  try {
    const { te_cuotas, te_monto, te_descripcion, te_monto_cuotas, empleado_idempleado } = req.body;
    console.log(req.body)
    // Insertar el usuario en la base de datos con la contraseña hasheada
    
    const [result] = await pool.query('INSERT INTO tienda_emp(te_cuotas, te_monto, te_descripcion,empleado_idempleado, te_monto_cuotas) VALUES (?, ?, ?, ?,?)', [te_cuotas, te_monto, te_descripcion, empleado_idempleado, te_monto_cuotas]);

    res.json({ success: true, message: 'Usuario Deuda insertada correctamente' });
  } catch (error) {
    console.error('Error al insertar Horas:', error);
    res.status(500).json({ success: false, message: 'Error al insertar Horas' });
  }
});

router.post('/insertar_prestamo_banc', async (req, res) => {
  try {
    const { pr_cuotas, pr_monto, pr_descripcion, pr_monto_cuotas, empleado_idempleado } = req.body;
    
    // Inserta un nuevo registro en la tabla prestamo_banc
    const [result] = await pool.query('INSERT INTO prestamo_banc (pr_cuotas, pr_monto, pr_descripcion, pr_monto_cuotas, empleado_idempleado) VALUES (?, ?, ?, ?, ?)', [pr_cuotas, pr_monto, pr_descripcion, pr_monto_cuotas, empleado_idempleado]);

    res.json({ success: true, message: 'Prestamo bancario insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar Prestamo Bancario:', error);
    res.status(500).json({ success: false, message: 'Error al insertar Prestamo Bancario' });
  }
});

router.post('/insertar_actualizar_ingreso_empleado', async (req, res) => {
  try {
    const { fecha, hora_entrada, hora_salida, empleado_id, descripcion } = req.body;

    // Consulta para verificar si el id ya existe en la tabla ingreso_empleado
    const [resultCheck] = await pool.query('SELECT * FROM ingreso_empleado WHERE empleado_id = ?', [empleado_id]);

    if (resultCheck.length > 0) {
      // Si el id ya existe, realiza una actualización
      const updateData = {};
      if (fecha) updateData.fecha = fecha;
      if (hora_entrada) updateData.hora_entrada = hora_entrada;
      if (hora_salida) updateData.hora_salida = hora_salida;
      if (empleado_id) updateData.empleado_id = empleado_id;
      if (descripcion) updateData.descripcion = descripcion;

      const [result] = await pool.query('UPDATE ingreso_empleado SET ? WHERE empleado_id = ?', [updateData, empleado_id]);

      res.json({ success: true, message: 'Ingreso de empleado actualizado correctamente' });
    } else {
      // Si el id no existe, realiza una inserción
      const [result] = await pool.query(
        'INSERT INTO ingreso_empleado (fecha, hora_entrada, hora_salida, empleado_id, descripcion) VALUES (?, ?, ?, ?, ?)',
        [fecha, hora_entrada, hora_salida, empleado_id, descripcion]
      );

      res.json({ success: true, message: 'Ingreso de empleado insertado correctamente' });
    }
  } catch (error) {
    console.error('Error al insertar/actualizar Ingreso de Empleado:', error);
    res.status(500).json({ success: false, message: 'Error al insertar/actualizar Ingreso de Empleado' });
  }
});





export default router;
