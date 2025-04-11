// src/infrastructure/routes/assinaturaClienteRoutes.js
const express = require('express');
const router = express.Router();
const Assinatura = require('../../domain/entities/Assinatura');
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');

// Configurar as associações
Assinatura.belongsTo(Cliente, { foreignKey: 'codCli' });
Assinatura.belongsTo(Plano, { foreignKey: 'codPlano' });

// Buscar assinaturas por cliente
router.get('/:codCli', async (req, res) => {
    try {
        const { codCli } = req.params;
        
        // Verificar se o cliente existe
        const cliente = await Cliente.findByPk(codCli);
        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }
        
        // Buscar todas as assinaturas do cliente
        const assinaturas = await Assinatura.findAll({
            where: { codCli },
            include: [
                { model: Plano, as: 'Plano' }
            ]
        });
        
        if (assinaturas.length === 0) {
            return res.json({ 
                mensagem: 'Este cliente não possui assinaturas',
                cliente: cliente.nome,
                assinaturas: []
            });
        }
        
        res.json({
            cliente: cliente.nome,
            quantidade: assinaturas.length,
            assinaturas: assinaturas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
