const express = require('express');
const router = express.Router();
const Assinatura = require('../../domain/entities/Assinatura');
const eventManager = require('../events/eventManager');

// Cache em memória para armazenar o status das assinaturas
const assinaturasCache = new Map();

// Função para verificar se uma assinatura está ativa
const verificarAssinaturaAtiva = async (codAss) => {
    // Verificar se a informação está em cache
    if (assinaturasCache.has(codAss)) {
        console.log(`Usando cache para assinatura ${codAss}`);
        return assinaturasCache.get(codAss);
    }

    console.log(`Cache miss para assinatura ${codAss}, consultando banco de dados`);
    
    // Se não estiver em cache, buscar no banco de dados
    const assinatura = await Assinatura.findByPk(codAss);
    
    if (!assinatura) {
        return false; // Assinatura não encontrada
    }
    
    const hoje = new Date();
    const fimFidelidade = new Date(assinatura.fimFidelidade);
    const ultimoPagamento = assinatura.dataUltimoPagamento ? new Date(assinatura.dataUltimoPagamento) : null;
    
    // Regra: A assinatura está ativa se:
    // 1. A data de fim de fidelidade é maior que a data atual AND
    // 2. O último pagamento foi há menos de 30 dias (ou não há registro de pagamento ainda - nova assinatura)
    let ativa = fimFidelidade > hoje;
    
    if (ativa && ultimoPagamento) {
        // Verificar se o último pagamento foi há menos de 30 dias
        const trintaDiasEmMilissegundos = 30 * 24 * 60 * 60 * 1000;
        ativa = (hoje - ultimoPagamento) <= trintaDiasEmMilissegundos;
    }
    
    // Armazenar o resultado em cache
    assinaturasCache.set(codAss, ativa);
    
    return ativa;
};

// Endpoint para verificar se uma assinatura está ativa
router.get('/:codass', async (req, res) => {
    try {
        const { codass } = req.params;
        const ativa = await verificarAssinaturaAtiva(parseInt(codass, 10));
        
        res.json(ativa);
    } catch (error) {
        console.error('Erro ao verificar se plano está ativo:', error);
        res.status(500).json({ erro: 'Erro ao verificar se plano está ativo', detalhe: error.message });
    }
});

// Listener para evento de pagamento - remover da cache quando um pagamento for registrado
eventManager.on('PagamentoPlanoServicoPlanosAtivos', (dadosPagamento) => {
    const { codigoAssinatura } = dadosPagamento;
    
    console.log(`Evento recebido: Pagamento registrado para assinatura ${codigoAssinatura}. Removendo do cache.`);
    
    // Remover do cache para forçar uma nova consulta na próxima requisição
    if (assinaturasCache.has(codigoAssinatura)) {
        assinaturasCache.delete(codigoAssinatura);
    }
});

// Endpoint adicional para limpar o cache (útil para testes)
router.delete('/cache/limpar', (req, res) => {
    assinaturasCache.clear();
    res.json({ mensagem: 'Cache limpo com sucesso' });
});

// Endpoint para verificar o conteúdo do cache (útil para debug)
router.get('/cache/status', (req, res) => {
    const cacheEntries = Array.from(assinaturasCache.entries()).map(([key, value]) => {
        return { codAss: key, ativa: value };
    });
    
    res.json({
        tamanhoCache: assinaturasCache.size,
        entradas: cacheEntries
    });
});

module.exports = router;
