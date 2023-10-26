import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

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
      console.error('Error al consultar usuarios:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
});


export default router;
