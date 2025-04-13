
const request = require('supertest');
const { app } = require('../src/infrastructure/server');
require('./setup');
const eventManager = require('../src/infrastructure/events/eventManager');

describe('Testes do ServicoFaturamento', () => {
  beforeAll(() => {
    // Criar um listener de teste para os eventos
    eventManager.on('PagamentoPlanoServicoGestao', (data) => {
      console.log('Evento de teste capturado:', data);
    });
  });
  
  afterAll(() => {
    // Limpar os listeners de teste
    eventManager.removeAllListeners('PagamentoPlanoServicoGestao');
  });

  it('Deve registrar um novo pagamento', async () => {
    const response = await request(app).post('/faturamento/registrarpagamento').send({
      dia: 15,
      mes: 4,
      ano: 2025,
      codigoAssinatura: 1,
      valorPago: 99.90
    });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('mensagem', 'Pagamento registrado com sucesso');
    expect(response.body).toHaveProperty('pagamento');
    expect(response.body.pagamento).toHaveProperty('codigo');
  });

  it('Deve listar os pagamentos', async () => {
    const response = await request(app).get('/faturamento');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
