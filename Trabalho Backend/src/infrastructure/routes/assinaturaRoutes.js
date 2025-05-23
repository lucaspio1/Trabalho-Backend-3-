// src/infrastructure/routes/assinaturaRoutes.js
const express = require('express');
const Assinatura = require('../../domain/entities/Assinatura');
const Plano = require('../../domain/entities/Plano');
const Cliente = require('../../domain/entities/Cliente');
const { Op } = require('sequelize');
const router = express.Router();

// Configurar as associações
Assinatura.belongsTo(Cliente, { foreignKey: 'codCli' });
Assinatura.belongsTo(Plano, { foreignKey: 'codPlano' });

// Criar uma nova assinatura
router.post('/', async (req, res) => {
    try {
        let { codPlano, codCli, inicioFidelidade, fimFidelidade, custoFinal, descricao } = req.body;
        
        // Se as datas de fidelidade não forem fornecidas, calcula automaticamente
        if (!inicioFidelidade) {
            inicioFidelidade = new Date();
        }
        
        if (!fimFidelidade) {
            // Por padrão, adicionamos 12 meses (1 ano) de fidelidade
            const dataFim = new Date(inicioFidelidade);
            dataFim.setFullYear(dataFim.getFullYear() + 1);
            fimFidelidade = dataFim;
        }
        
        // Se custoFinal não for fornecido, usa o valor do plano
        if (!custoFinal) {
            const plano = await Plano.findByPk(codPlano);
            if (plano) {
                custoFinal = plano.custoMensal;
            }
        }
        
        const assinatura = await Assinatura.create({ 
            codPlano, 
            codCli, 
            inicioFidelidade, 
            fimFidelidade, 
            custoFinal, 
            descricao 
        });
        
        res.status(201).json(assinatura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar todas as assinaturas com opção de filtrar por status
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const hoje = new Date();
        let whereCondition = {};
        let statusDescricao = 'TODOS';
        
        if (status) {
            switch (status.toUpperCase()) {
                case 'ATIVOS':
                    // Assinaturas com data de fim de fidelidade no futuro
                    whereCondition = {
                        fimFidelidade: {
                            [Op.gt]: hoje
                        }
                    };
                    statusDescricao = 'ATIVOS';
                    break;
                case 'CANCELADOS':
                    // Para este exemplo, consideramos canceladas aquelas com data de fim igual ou anterior à data atual
                    whereCondition = {
                        fimFidelidade: {
                            [Op.lte]: hoje
                        }
                    };
                    statusDescricao = 'CANCELADOS';
                    break;
                // Se status não for reconhecido ou for 'TODOS', não aplica filtro
            }
        }
        
        const assinaturas = await Assinatura.findAll({
            where: whereCondition,
            include: [
                { model: Cliente, as: 'Cliente' },
                { model: Plano, as: 'Plano' }
            ]
        });
        
        res.json({
            status: statusDescricao,
            quantidade: assinaturas.length,
            assinaturas: assinaturas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar assinatura por ID
router.get('/:id', async (req, res) => {
    try {
        const assinatura = await Assinatura.findByPk(req.params.id);
        if (!assinatura) {
            return res.status(404).json({ mensagem: 'Assinatura não encontrada' });
        }
        res.json(assinatura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Renovar assinatura
router.put('/:id/renovar', async (req, res) => {
    try {
        const assinatura = await Assinatura.findByPk(req.params.id);
        if (!assinatura) {
            return res.status(404).json({ mensagem: 'Assinatura não encontrada' });
        }
        
        // Atualiza a data de fim de fidelidade (adiciona 1 ano à data atual)
        const novaDataFim = new Date();
        novaDataFim.setFullYear(novaDataFim.getFullYear() + 1);
        
        await assinatura.update({ 
            fimFidelidade: novaDataFim,
            inicioFidelidade: new Date() // Atualiza a data de início também
        });
        
        res.json({
            mensagem: 'Assinatura renovada com sucesso',
            assinatura: assinatura
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancelar assinatura
router.put('/:id/cancelar', async (req, res) => {
    try {
        const assinatura = await Assinatura.findByPk(req.params.id);
        if (!assinatura) {
            return res.status(404).json({ mensagem: 'Assinatura não encontrada' });
        }
        
        // Para indicar cancelamento, atualiza a data de fim de fidelidade para a data atual
        await assinatura.update({ 
            fimFidelidade: new Date()
        });
        
        res.json({
            mensagem: 'Assinatura cancelada com sucesso',
            assinatura: assinatura
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;