const express = require('express');
const router = express.Router();
const Pagamento = require('../../domain/entities/Pagamento');
const eventManager = require('../events/eventManager');

// Endpoint para registrar pagamento
router.post('/registrarpagamento', async (req, res) => {
    try {
        const { dia, mes, ano, codigoAssinatura, valorPago } = req.body;
        
        if (!dia || !mes || !ano || !codigoAssinatura || !valorPago) {
            return res.status(400).json({ erro: 'Dados incompletos para registrar pagamento' });
        }

        // Criar data de pagamento
        const dataPagamento = new Date(ano, mes - 1, dia); // mês em JS começa do 0
        
        // Registrar pagamento no banco
        const pagamento = await Pagamento.create({
            codAss: codigoAssinatura,
            valorPago,
            dataPagamento
        });

        // Preparar dados do evento
        const dadosEvento = {
            dia,
            mes,
            ano,
            codigoAssinatura,
            valorPago
        };

        // Emitir eventos para os serviços interessados
        eventManager.emit('PagamentoPlanoServicoGestao', dadosEvento);
        eventManager.emit('PagamentoPlanoServicoPlanosAtivos', dadosEvento);

        res.status(201).json({
            mensagem: 'Pagamento registrado com sucesso',
            pagamento
        });
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        res.status(500).json({ erro: 'Erro ao registrar pagamento', detalhe: error.message });
    }
});

// Listar todos os pagamentos (endpoint adicional para testes)
router.get('/', async (req, res) => {
    try {
        const pagamentos = await Pagamento.findAll();
        res.json(pagamentos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar pagamentos', detalhe: error.message });
    }
});

// Buscar pagamentos por assinatura
router.get('/assinatura/:codAss', async (req, res) => {
    try {
        const { codAss } = req.params;
        const pagamentos = await Pagamento.findAll({
            where: { codAss },
            order: [['dataPagamento', 'DESC']]
        });
        
        if (pagamentos.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum pagamento encontrado para esta assinatura' });
        }
        
        res.json({
            codigoAssinatura: codAss,
            quantidade: pagamentos.length,
            pagamentos
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar pagamentos', detalhe: error.message });
    }
});

module.exports = router;
