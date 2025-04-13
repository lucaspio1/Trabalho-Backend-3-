
const Assinatura = require('../../domain/entities/Assinatura');
const eventManager = require('./eventManager');

// Registrar o handler para o evento de pagamento
const inicializarHandlers = () => {
    eventManager.on('PagamentoPlanoServicoGestao', async (dadosPagamento) => {
        const { dia, mes, ano, codigoAssinatura, valorPago } = dadosPagamento;
        console.log(`Evento recebido no ServicoGestao: Pagamento de R$ ${valorPago} para assinatura ${codigoAssinatura}`);
        
        try {
            // Buscar a assinatura
            const assinatura = await Assinatura.findByPk(codigoAssinatura);
            
            if (!assinatura) {
                console.error(`Assinatura ${codigoAssinatura} não encontrada`);
                return;
            }
            
            // Atualizar a data do último pagamento
            const dataPagamento = new Date(ano, mes - 1, dia);
            
            await assinatura.update({
                dataUltimoPagamento: dataPagamento
            });
            
            console.log(`Assinatura ${codigoAssinatura} atualizada com sucesso. Data do último pagamento: ${dataPagamento}`);
        } catch (error) {
            console.error('Erro ao processar evento de pagamento:', error);
        }
    });
    
    console.log('Handlers de eventos do ServicoGestao inicializados');
};

module.exports = { inicializarHandlers };
