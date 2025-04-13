// src/infrastructure/database/seed.js
const db = require('./database');
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');
const Assinatura = require('../../domain/entities/Assinatura');
const Pagamento = require('../../domain/entities/Pagamento');

const seedDatabase = async () => {
    await db.sync({ force: true }); // Apaga e recria as tabelas

    console.log('Criando clientes...');
    const clientes = await Cliente.bulkCreate([
        { nome: 'João Silva', email: 'joao@email.com' },
        { nome: 'Maria Souza', email: 'maria@email.com' },
        { nome: 'Carlos Oliveira', email: 'carlos@email.com' },
        { nome: 'Ana Lima', email: 'ana@email.com' },
        { nome: 'Pedro Santos', email: 'pedro@email.com' },
        { nome: 'Lucia Ferreira', email: 'lucia@email.com' },
        { nome: 'Roberto Almeida', email: 'roberto@email.com' },
        { nome: 'Patricia Gomes', email: 'patricia@email.com' },
        { nome: 'Fernando Costa', email: 'fernando@email.com' },
        { nome: 'Amanda Ribeiro', email: 'amanda@email.com' }
    ]);

    console.log('Criando planos...');
    const planos = await Plano.bulkCreate([
        { nome: 'Plano Básico', custoMensal: 99.90, descricao: '100MB de internet' },
        { nome: 'Plano Premium', custoMensal: 199.90, descricao: '500MB de internet + TV' },
        { nome: 'Plano Empresarial', custoMensal: 299.90, descricao: '1GB de internet + Suporte 24h' },
        { nome: 'Plano Ultra', custoMensal: 399.90, descricao: '2GB de internet + TV + Telefone' },
        { nome: 'Plano Família', custoMensal: 249.90, descricao: '1GB de internet + TV + 4 linhas móveis' }
    ]);

    console.log('Criando assinaturas...');
    const assinaturas = await Assinatura.bulkCreate([
        {
            codPlano: planos[0].codigo,
            codCli: clientes[0].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            dataUltimoPagamento: new Date(),
            custoFinal: 89.90,
            descricao: 'Desconto de fidelidade aplicado'
        },
        {
            codPlano: planos[1].codigo,
            codCli: clientes[1].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            dataUltimoPagamento: new Date(),
            custoFinal: 179.90,
            descricao: 'Plano premium com desconto anual'
        },
        {
            codPlano: planos[2].codigo,
            codCli: clientes[2].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            dataUltimoPagamento: new Date(),
            custoFinal: 279.90,
            descricao: 'Plano empresarial com suporte dedicado'
        },
        {
            codPlano: planos[3].codigo,
            codCli: clientes[3].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            dataUltimoPagamento: new Date(),
            custoFinal: 379.90,
            descricao: 'Plano ultra com todos os serviços incluídos'
        },
        {
            codPlano: planos[4].codigo,
            codCli: clientes[4].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            dataUltimoPagamento: new Date(),
            custoFinal: 229.90,
            descricao: 'Plano família com desconto promocional'
        }
    ]);

    console.log('Criando pagamentos...');
    const hoje = new Date();
    const ultimoMes = new Date();
    ultimoMes.setMonth(ultimoMes.getMonth() - 1);
    
    await Pagamento.bulkCreate([
        {
            codAss: assinaturas[0].codigo,
            valorPago: 89.90,
            dataPagamento: ultimoMes
        },
        {
            codAss: assinaturas[1].codigo,
            valorPago: 179.90,
            dataPagamento: ultimoMes
        },
        {
            codAss: assinaturas[2].codigo,
            valorPago: 279.90,
            dataPagamento: ultimoMes
        },
        {
            codAss: assinaturas[3].codigo,
            valorPago: 379.90,
            dataPagamento: ultimoMes
        },
        {
            codAss: assinaturas[4].codigo,
            valorPago: 229.90,
            dataPagamento: ultimoMes
        }
    ]);

    console.log('Banco populado com sucesso!');
    process.exit();
};

seedDatabase();
