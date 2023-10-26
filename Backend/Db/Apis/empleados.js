import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vista_usuarios');
      res.json({ success: true, users: rows });
    } catch (error) {
      console.error('Error al consultar usuarios:', error);
      res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
    }
});


export default router;
