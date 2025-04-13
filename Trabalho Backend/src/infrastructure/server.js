const express = require('express');
const bodyParser = require('body-parser');
const planoRoutes = require('./routes/planoRoutes');
const assinaturaRoutes = require('./routes/assinaturaRoutes');
const assinaturaClienteRoutes = require('./routes/assinaturaClienteRoutes');
const assinaturaPlanoRoutes = require('./routes/assinaturaPlanoRoutes');
const servicoStatusAssinaturaRoutes = require('./routes/servicoStatusAssinatura');
const faturamentoRoutes = require('./routes/faturamentoRoutes');
const planosAtivosRoutes = require('./routes/planosAtivosRoutes');
const db = require('./database/database');
const clienteRoutes = require('./routes/clienteRoutes');
const { inicializarHandlers } = require('./events/gestaoEventHandlers');

// Criar aplicação Express
const app = express();
app.use(bodyParser.json());

// Rotas
app.use('/gestao/planos', planoRoutes);
app.use('/gestao/assinaturas', assinaturaRoutes);
app.use('/gestao/assinaturascliente', assinaturaClienteRoutes);
app.use('/gestao/assinaturasplano', assinaturaPlanoRoutes);
app.use('/servico/status-assinatura', servicoStatusAssinaturaRoutes);
app.use('/gestao/clientes', clienteRoutes);

// Novas rotas para os microsserviços da Fase 2
app.use('/faturamento', faturamentoRoutes);
app.use('/planosativos', planosAtivosRoutes);

// Variável para armazenar a instância do servidor
let server;

// Função para iniciar o servidor
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, async () => {
    try {
      // Configurar as associações
      const Assinatura = require('../domain/entities/Assinatura');
      const Cliente = require('../domain/entities/Cliente');
      const Plano = require('../domain/entities/Plano');
      const Pagamento = require('../domain/entities/Pagamento');
      
      Assinatura.belongsTo(Cliente, { foreignKey: 'codCli' });
      Assinatura.belongsTo(Plano, { foreignKey: 'codPlano' });
      
      // Inicializar os handlers de eventos
      inicializarHandlers();
      
      await db.sync();
      console.log(`Servidor rodando na porta ${PORT}`);
    } catch (error) {
      console.error('Erro ao iniciar o servidor:', error);
    }
  });
  return server;
};

// Função para parar o servidor
const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
};

// Iniciar o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, stopServer, db };
