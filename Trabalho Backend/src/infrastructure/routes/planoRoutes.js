const express = require('express');
const Plano = require('../../domain/entities/Plano');
const router = express.Router();

router.get('/', async (req, res) => {
    const planos = await Plano.findAll();
    res.json(planos);
});

// Adicionando rota PATCH para atualizar plano
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, custoMensal, descricao } = req.body;
        
        const plano = await Plano.findByPk(id);
        if (!plano) {
            return res.status(404).json({ mensagem: 'Plano não encontrado' });
        }
        
        // Atualiza apenas os campos enviados
        await plano.update({
            ...(nome && { nome }),
            ...(custoMensal !== undefined && { custoMensal }),
            ...(descricao && { descricao })
        });
        
        res.json({ 
            mensagem: 'Plano atualizado com sucesso', 
            plano 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
