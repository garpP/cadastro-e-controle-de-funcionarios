# 🚀 Cadastro e Gerenciamento de Funcionários

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

> **Sistema de alta fidelidade para controle de pessoal, operando em modo Kiosk (Tela Cheia) para máxima produtividade e segurança.**

---

## 📋 1. Funcionamento e Aplicações

O sistema foi desenvolvido para ser uma ferramenta de terminal dedicada, focada na experiência do usuário e na integridade dos dados. 

**Nota técnica:** Este projeto é uma base sólida e modular. Embora funcional, ele foi desenhado para permitir um **fácil aprimoramento**, podendo ser rapidamente adaptado para diversas outras funcionalidades e fluxos de trabalho corporativos.

### 🔹 Funções Principais
* **Navegação por Etapas:** Cadastro dividido em 3 passos para evitar fadiga de decisão e erros de digitação.
* **Persistência em Nuvem:** Integração direta com **Firebase Firestore** para sincronização em tempo real.
* **Interface Responsiva:** Desenvolvido com **Material UI**, garantindo componentes visuais modernos e acessíveis.
* **Bloqueio de Ambiente:** O App inicia automaticamente em tela cheia, ocultando barras de tarefas e menus do sistema operacional.

### 🔹 Possíveis Aplicações
1. **Totens de Autoatendimento:** Ideal para recepções onde o colaborador realiza seu próprio pré-cadastro.
2. **Estações de RH:** Software dedicado para computadores de uso exclusivo administrativo.
3. **Controle de Acesso:** Registro rápido de funcionários em canteiros de obras ou eventos corporativos.

---

## 🔐 2. Camadas de Segurança e Senhas

O aplicativo utiliza uma estratégia de segurança dupla para proteger os dados e o ambiente de execução.

### 🔑 Acesso ao Painel
* **Acesso Administrativo Padrão:**
  * **E-mail:** `admin1029@gmail.com`
  * **Senha:** `adm123`
* **Validação:** Apenas usuários previamente cadastrados na coleção `funcionarios` com e-mail e senha correspondentes podem acessar a Home. Também é possível criar novas contas através do fluxo de registro.

### 🔒 Passe de Administrador (Privilégios Elevados)
Para ações sensíveis e gerenciamento do sistema, utiliza-se o código de segurança: `adm0129384756`.

#### Onde usar o Passe:
1. **Encerrar Aplicativo:** Na tela de login, clique em **Encerrar Sistema**. O campo para inserção do passe aparecerá via animação `Collapse`.
2. **Privilégios de Gestão:** Ao clicar no ícone de **engrenagem** no menu lateral, insira o passe de ADM para liberar as seguintes funções:
   * Criar e excluir departamentos.
   * Criar, alterar dados e excluir funcionários/usuários.
   * Gestão completa da base de dados.

---

## 💻 3. Como Executar o App

### ⚡ Maneira Rápida
Para uso imediato, basta baixar e executar o arquivo: 
`Sistema Cadastro Flugo.exe` https://drive.google.com/drive/folders/1JQOXlTEnRr_geZj6WqDfXphZgmv_qna9?usp=sharing

### 🛠️ Modo Desenvolvedor
Para rodar o projeto localmente e realizar alterações, utilize os comandos abaixo no terminal:

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o servidor Vite (Frontend)
npm run dev

# 3. Rodar o Electron (Janela Desktop) - em um novo terminal
npm run electron:dev
