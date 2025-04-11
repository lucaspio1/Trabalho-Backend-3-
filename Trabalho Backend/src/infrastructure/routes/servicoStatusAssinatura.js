// src/infrastructure/routes/servicoStatusAssinatura.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Assinatura = require('../../domain/entities/Assinatura');
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');

// Listar assinaturas por status (ativas, vencidas, canceladas)
router.get('/status/:statusTipo', async (req, res) => {
    try {
        const { statusTipo } = req.params;
        const hoje = new Date();
        let whereCondition = {};
        
        switch (statusTipo.toLowerCase()) {
            case 'ativas':
                // Assinaturas com data de fim de fidelidade no futuro
                whereCondition = {
                    fimFidelidade: {
                        [Op.gt]: hoje
                    }
                };
                break;
            case 'vencidas':
                // Assinaturas com data de fim de fidelidade no passado
                whereCondition = {
                    fimFidelidade: {
                        [Op.lt]: hoje
                    }
                };
                break;
            case 'canceladas':
                // Para este exemplo, consideramos canceladas aquelas com data de fim igual ou anterior à data atual
                // Normalmente seria necessário um campo adicional para marcar como cancelada
                whereCondition = {
                    fimFidelidade: {
                        [Op.lte]: hoje
                    }
                };
                break;
            default:
                return res.status(400).json({ mensagem: 'Status inválido. Use: ativas, vencidas ou canceladas' });
        }
        
        const assinaturas = await Assinatura.findAll({
            where: whereCondition,
            include: [
                { model: Cliente, attributes: ['codigo', 'nome', 'email'] },
                { model: Plano, attributes: ['codigo', 'nome', 'custoMensal', 'descricao'] }
            ]
        });
        
        if (assinaturas.length === 0) {
            return res.status(404).json({ mensagem: `Nenhuma assinatura com status "${statusTipo}" encontrada` });
        }
        
        res.json({
            status: statusTipo,
            quantidade: assinaturas.length,
            assinaturas: assinaturas
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar assinaturas por status', detalhe: error.message });
    }
});

// Verificar status de uma assinatura específica
router.get('/verificar/:assinaturaId', async (req, res) => {
    try {
        const { assinaturaId } = req.params;
        
        const assinatura = await Assinatura.findByPk(assinaturaId, {
            include: [
                { model: Cliente, attributes: ['codigo', 'nome', 'email'] },
                { model: Plano, attributes: ['codigo', 'nome', 'custoMensal', 'descricao'] }
            ]
        });
        
        if (!assinatura) {
            return res.status(404).json({ mensagem: 'Assinatura não encontrada' });
        }
        
        const hoje = new Date();
        const fimFidelidade = new Date(assinatura.fimFidelidade);
        
        let status;
        let diasRestantes = 0;
        
        if (fimFidelidade > hoje) {
            status = 'Ativa';
            diasRestantes = Math.ceil((fimFidelidade - hoje) / (1000 * 60 * 60 * 24));
        } else {
            status = 'Vencida';
        }
        
        res.json({
            codigo: assinatura.codigo,
            status,
            diasRestantes,
            inicioFidelidade: assinatura.inicioFidelidade,
            fimFidelidade: assinatura.fimFidelidade,
            cliente: assinatura.Cliente,
            plano: assinatura.Plano,
            custoFinal: assinatura.custoFinal,
            descricao: assinatura.descricao
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao verificar status da assinatura', detalhe: error.message });
    }
});

module.exports = router;