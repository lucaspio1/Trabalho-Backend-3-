
# Sistema Backend para Gestão de Planos de Operadoras de Internet


Este projeto implementa um backend para gerenciar planos de operadoras de internet, clientes, assinaturas e pagamentos. Adotamos a **Arquitetura Limpa** e os princípios **SOLID** para garantir um código modular, testável e fácil de manter.


## 💡 Funcionalidades Principais

*   **Cadastro de Clientes:** Gerencie informações detalhadas dos seus clientes.
*   **Gerenciamento de Planos:** Defina e personalize diferentes planos de internet.
*   **Assinaturas:** Crie, renove e cancele assinaturas de forma eficiente.
*   **Controle de Pagamentos:** Registre e acompanhe os pagamentos das assinaturas.
*   **API RESTful:** Uma API completa para interagir com o sistema.
*   **Testes Automatizados:** Garanta a qualidade do código com testes unitários e de integração.

## 🛠️ Tecnologias Utilizadas

*   **Backend:**
    *   [Node.js](https://nodejs.org/en/): Plataforma de execução JavaScript para o backend.
    *   [Express](https://expressjs.com/): Framework para criação de APIs REST.
    *   [Sequelize](https://sequelize.org/): ORM para facilitar a interação com o banco de dados.
*   **Banco de Dados:**
    *   [MySQL](https://www.mysql.com/): Banco de dados relacional para armazenar os dados.
*   **Testes:**
    *   [Jest](https://jestjs.io/): Framework de testes JavaScript.
    *   [Supertest](https://github.com/visionmedia/supertest): Biblioteca para testar APIs HTTP.
*   **Outras Ferramentas:**
    *   [Postman](https://www.postman.com/): Ferramenta para testar e documentar os endpoints da API.

## 🗂️ Estrutura do Projeto

```
/backend
|-- src
|   |-- application      # Lógica de casos de uso
|   |-- domain           # Regras de negócio e entidades
|   |   |-- entities
|   |-- infrastructure   # Implementações concretas (banco de dados, rotas.)
|   |   |-- repositories
|   |   |-- database
|   |   |-- routes
|   |   |-- server.js    # Ponto de entrada da aplicação
|-- tests              # Testes unitários e de integração
|-- package.json       # Informações e dependências do projeto
|-- README.md          # Documentação do projeto
```

## ⚙️ Instalação e Configuração

### ⚠️ Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
*   [MySQL](https://www.mysql.com/)

### 📦 Instalando Dependências


npm install


### ⚙️ Configurando o Banco de Dados

1.  No MySQL, crie o banco de dados:

    
    CREATE DATABASE operadora_db;
    

2.  Edite o arquivo `src/infrastructure/database/database.js` e configure as credenciais do banco de dados.

### 🌱 Populando o Banco de Dados (Opcional)

Para inserir dados iniciais no banco de dados (útil para testes):


node src/infrastructure/database/seed.js


### 🚀 Iniciando o Servidor


npm start


O backend estará rodando em `http://localhost:3000`.

## 🕹️ Endpoints da API

Aqui está uma visão geral dos principais endpoints da API:

### 👤 Clientes

*   `GET /gestao/clientes`: Lista todos os clientes.
*   
### 🏢 Planos

*   `GET /gestao/planos`: Lista todos os planos.
*  
### 📝 Assinaturas

*   `POST /gestao/assinaturas`: Cria uma nova assinatura.

*  `PATCH /gestao/planos/{idPlano}`: Atualiza o custo mensal de um plano específico.

* `GET /gestao/assinaturas/status/ATIVOS`:Lista assinaturas ativas.

* `GET /gestao/assinaturas/status/TODOS`: Lista todas as assinaturas.

* `GET /gestao/assinaturas/status/CANCELADOS`: Lista assinaturas canceladas.

* `GET /gestao/assinaturascliente/{codcli}` :Lista assinaturas de um cliente específico.

* `GET /gestao/assinaturasplano/{codplano}`: Lista assinaturas de um plano específico.


## ✅ Testes Automatizados

Para executar os testes automatizados:


npm test


Isso executará os testes unitários e de integração definidos na pasta `tests/`.

## 📦 Postman Collection

Para facilitar o teste dos endpoints, disponibilizamos uma collection do Postman. Importe o arquivo `postman.json` no Postman.


