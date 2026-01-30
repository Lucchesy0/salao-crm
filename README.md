# 💇 Salão CRM - Sistema de Gerenciamento

> Sistema completo de gerenciamento para salões de beleza com interface moderna e profissional

## ✨ Funcionalidades

### 🔒 Sistema de Autenticação
- Login com diferentes níveis de acesso:
  - **Admin**: Controle total do sistema
  - **Cabeleireira**: Gestão de agendamentos e clientes
  - **Auxiliar**: Gestão de agendamentos e clientes
  - **Cliente**: Visualização de agendamentos

### 📊 Dashboard
- Estatísticas em tempo real
- Visão geral do negócio
- Cards interativos com animações

### 👥 Gestão de Pessoas
- Cadastro de auxiliares
- Cadastro de cabeleireiras
- Cadastro de clientes
- **Botão deletar (apenas admin)**
- Confirmação antes de deletar

### 💼 Gestão de Serviços
- Cadastro de serviços com preços
- Edição de serviços
- **Deleção (apenas admin)**

### 📅 Agendamentos
- Sistema completo de agendamentos
- Código único por procedimento
- Busca por código
- Gestão de horários

### 🎨 Interface Moderna
- Design profissional com gradientes
- Animações suaves
- Responsivo para mobile/tablet/desktop
- Paleta de cores moderna (slate/blue)
- Tipografia otimizada

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool rápido
- **CSS Moderno** - Custom properties, gradientes, animações

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração

## 🛠️ Instalação e Uso

### Opção 1: Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/Lucchesy0/salao-crm.git
cd salao-crm

# 2. Checkout na branch com melhorias
git checkout feature/improve-ui-and-permissions

# 3. Construir e iniciar containers
docker-compose up -d --build

# 4. Acessar aplicação
# http://localhost:3000
```

### Opção 2: Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar MySQL localmente
# Criar banco 'salao' no MySQL

# 3. Iniciar desenvolvimento
npm run dev

# 4. Em outro terminal, iniciar Vite
npm run build
npm start
```

## 👤 Usuários de Teste

| Usuário | Senha | Permissões |
|----------|-------|-------------|
| admin | 123 | Controle total, deletar itens |
| cabeleireira | 123 | Visualizar e criar agendamentos |
| auxiliar | 123 | Visualizar e criar agendamentos |
| cliente | 123 | Visualizar próprios agendamentos |

## 📝 Comandos Úteis

### Docker
```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild
docker-compose up -d --build

# Remover tudo (incluindo volumes)
docker-compose down -v
```

### NPM
```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Iniciar servidor
npm start

# Preview do build
npm run preview
```

## 📦 Estrutura do Projeto

```
salao-crm/
├── src/
│   ├── components/       # Componentes React
│   │   ├── CRUDList.jsx    # Lista com botão deletar
│   │   ├── CRUDForm.jsx
│   │   └── Navigation.jsx
│   ├── pages/           # Páginas
│   │   ├── Auxiliares.jsx  # Com delete
│   │   ├── Clientes.jsx    # Com delete
│   │   ├── Servicos.jsx    # Com delete
│   │   └── Dashboard.jsx
│   ├── utils/           # Utilitários
│   └── index.css        # CSS profissional
├── server.js            # Backend Express
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # MySQL + App
├── package.json
└── vite.config.js
```

## ⚙️ Variáveis de Ambiente

```bash
# Servidor
PORT=3000
NODE_ENV=production

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha123
DB_DATABASE=salao
```

## 🔐 Permissões

### Admin pode:
- ✅ Criar, visualizar, editar e **deletar** todos os recursos
- ✅ Acessar todas as páginas
- ✅ Gerenciar usuários

### Cabeleireira/Auxiliar pode:
- ✅ Visualizar clientes e serviços (somente leitura)
- ✅ Criar e gerenciar agendamentos
- ❌ Não pode deletar

### Cliente pode:
- ✅ Visualizar próprios agendamentos
- ❌ Acesso limitado

## 🎉 Novas Funcionalidades

### v2.0 (Feature Branch)
- ✨ Design completamente reformulado
- ✨ Botão deletar para admin
- ✨ Mensagens de confirmação
- ✨ Animações fluidas
- ✨ Responsividade aprimorada
- ✨ Build otimizado para Docker
- ✨ Multi-stage Dockerfile
- ✨ Health checks

## 🐛 Issues e Contribuições

Encontrou um bug? Tem uma sugestão?
1. Abra uma issue no GitHub
2. Descreva o problema/sugestão
3. Aguarde retorno

## 📝 Licença

MIT License - Livre para uso pessoal e comercial

---

**Desenvolvido com ❤️ para salões de beleza** 💇‍♀️
