const express = require('express');
const Cliente = require('../../domain/entities/Cliente');
const router = express.Router();

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
