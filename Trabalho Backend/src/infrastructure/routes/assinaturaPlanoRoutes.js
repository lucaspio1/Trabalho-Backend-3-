// src/infrastructure/routes/assinaturaPlanoRoutes.js
const express = require('express');
const router = express.Router();
const Assinatura = require('../../domain/entities/Assinatura');
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');

// Configurar as associações
Assinatura.belongsTo(Cliente, { foreignKey: 'codCli' });
Assinatura.belongsTo(Plano, { foreignKey: 'codPlano' });

// Buscar assinaturas por plano
router.get('/:codPlano', async (req, res) => {
    try {
        const { codPlano } = req.params;
        
        // Verificar se o plano existe
        const plano = await Plano.findByPk(codPlano);
        if (!plano) {
            return res.status(404).json({ mensagem: 'Plano não encontrado' });
        }
        
        // Buscar todas as assinaturas do plano
        const assinaturas = await Assinatura.findAll({
            where: { codPlano },
            include: [
                { model: Cliente, as: 'Cliente' }
            ]
        });
        
        if (assinaturas.length === 0) {
            return res.json({ 
                mensagem: 'Este plano não possui assinaturas',
                plano: plano.nome,
                assinaturas: []
            });
        }
        
        res.json({
            plano: plano.nome,
            quantidade: assinaturas.length,
            assinaturas: assinaturas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;