const request = require('supertest');
const { app } = require('../src/infrastructure/server');
require('./setup');

describe('Testes do ServicoPlanosAtivos', () => {
  it('Deve verificar se uma assinatura está ativa', async () => {
    // Primeiro criar uma assinatura para teste
    const assinaturaResponse = await request(app).post('/gestao/assinaturas').send({
      codPlano: 1,
      codCli: 1,
      inicioFidelidade: new Date(),
      fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      custoFinal: 89.90,
      descricao: 'Assinatura de teste para verificação de status'
    });
    
    const codAss = assinaturaResponse.body.codigo;
    
    // Agora verificar se está ativa
    const response = await request(app).get(`/planosativos/${codAss}`);
    
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('boolean');
  });

  it('Deve retornar o status do cache', async () => {
    const response = await request(app).get('/planosativos/cache/status');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('tamanhoCache');
    expect(response.body).toHaveProperty('entradas');
  });

  it('Deve limpar o cache', async () => {
    const response = await request(app).delete('/planosativos/cache/limpar');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensagem', 'Cache limpo com sucesso');
    
    // Verificar se o cache está realmente vazio
    const cacheResponse = await request(app).get('/planosativos/cache/status');
    expect(cacheResponse.body.tamanhoCache).toBe(0);
  });
});
