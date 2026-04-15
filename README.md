# 💰 FinanceApp

Aplicação fullstack para gerenciamento financeiro pessoal, permitindo o controle de **pessoas, categorias e transações**, com cálculo de totais por pessoa e geral.

---

# 🚀 Tecnologias Utilizadas

### 🔹 Backend

* .NET 10
* Entity Framework Core (ORM)
* SQL Server
* Docker / Docker Compose
* Scalar (documentação de endpoints)

### 🔹 Frontend

* React
* TypeScript
* Fetch API

---

# 🧱 Arquitetura

## 🎯 Frontend (React + TS)

Estrutura baseada em separação de responsabilidades:

```
src/
├── constants/
│   └── api.ts
├── types/
│   └── index.ts
├── services/
│   ├── pessoaService.ts
│   ├── categoriaService.ts
│   └── transacaoService.ts
├── components/
│   ├── Toast.tsx
│   └── Sidebar.tsx
├── views/
│   ├── PessoasView.tsx
│   ├── CategoriasView.tsx
│   └── TransacoesView.tsx
└── App.tsx
```

### 📌 Responsabilidade de cada camada

#### 📁 constants/

Contém configurações globais da aplicação, como:

* URL base da API

---

#### 📁 types/

Define as tipagens (DTOs) utilizadas na aplicação:

* Pessoa
* Categoria
* Transação
* Respostas paginadas

Garante **tipagem forte e segurança no consumo da API**.

---

#### 📁 services/

Responsável pela comunicação com o backend:

* Centraliza chamadas HTTP (fetch)
* Isola lógica de API das views

Exemplo:

* `getPessoas`
* `createPessoa`
* `deletePessoa`

---

#### 📁 components/

Componentes reutilizáveis da interface:

* `Toast` → feedback visual (sucesso/erro)
* `Sidebar` → navegação entre telas

---

#### 📁 views/

Camada de telas da aplicação:

* Contém regras de UI e interação com usuário
* Consome services
* Gerencia estado com hooks

Exemplo:

* Cadastro de pessoas
* Listagem
* Dashboard de totais

---

#### 📄 App.tsx

Componente raiz:

* Controle de navegação (tabs)
* Gerenciamento global de estado simples (toast)
* Orquestra as views

---

# 🏗️ Backend (.NET)

Estrutura baseada em **Arquitetura Limpa + Ports and Adapters**:

```
src/
├── API
├── Application
├── Domain
├── Infra
├── Shared

test/
└── DomainTest
```

---

## 📌 Camadas

### 🔹 Domain

* Núcleo da aplicação
* Contém:

  * Entidades
  * Regras de negócio
  * Interfaces de repositórios (**Ports**)

---

### 🔹 Application

* Casos de uso da aplicação
* Orquestra regras do domínio
* Faz uso das interfaces definidas no Domain

---

### 🔹 Infra

* Implementação das interfaces (Adapters)
* Acesso a banco de dados (EF Core)
* Seeds iniciais para popular dados

---

### 🔹 API

* Camada de exposição (Controllers)
* Contém Dockerfile
* Responsável por expor endpoints HTTP

---

### 🔹 Shared

* Utilitários compartilhados entre camadas

---

### 🔹 Testes

#### 📁 DomainTest

* Testes unitários do domínio
* Garantem que as **regras de negócio estão corretas**

---

# 🐳 Docker

O projeto backend possui:

* Dockerfile na API
* Docker Compose na raiz da solução

Responsável por subir:

* SQL Server (container)
* API (.NET)

---

# 🧠 Padrões e Conceitos Utilizados

* Clean Architecture
* Ports and Adapters
* Separação de responsabilidades
* Inversão de dependência
* ORM com Entity Framework Core

---

# 📜 Regras de Negócio

## 👤 Cadastro de Pessoas

* CRUD completo (criar, editar, excluir, listar)
* Campos:

  * Id (gerado automaticamente)
  * Nome (máx. 200 caracteres)
  * Idade

### 🔥 Regra importante:

* Ao excluir uma pessoa → **todas as transações dela são removidas**

---

## 🏷️ Cadastro de Categorias

* Criar e listar
* Campos:

  * Id (gerado automaticamente)
  * Descrição (máx. 400 caracteres)
  * Finalidade:

    * Despesa
    * Receita
    * Ambas

---

## 💸 Cadastro de Transações

* Criar e listar
* Campos:

  * Id
  * Descrição (máx. 400)
  * Valor (positivo)
  * Tipo:

    * Despesa
    * Receita
  * Categoria
  * Pessoa

### 🔥 Regras importantes:

* 👶 Menores de idade (< 18 anos):

  * **Só podem registrar despesas**

* 🧠 Validação de categoria:

  * Se a transação for **Despesa**, não pode usar categoria de **Receita**
  * Se for **Receita**, não pode usar categoria de **Despesa**

---

## 📊 Consulta de Totais

Para cada pessoa:

* Total de receitas
* Total de despesas
* Saldo (Receitas - Despesas)

### 📈 Total geral:

* Soma de todas as pessoas:

  * Total de receitas
  * Total de despesas
  * Saldo líquido

---

# ▶️ Como rodar o projeto

## Backend (Docker)

```bash
docker-compose up --build
```

---

## Frontend

```bash
npm install
npm run dev
```

---

# 📌 Considerações

Este projeto foi desenvolvido com foco em:

* Organização de código
* Boas práticas de arquitetura
* Separação clara de responsabilidades
* Facilidade de manutenção e escalabilidade

---

# 👨‍💻 Autor

Desenvolvido por Leonardo Pagni
