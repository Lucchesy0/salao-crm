# 🚀 Guia de Deploy - Salão CRM

## 📦 Deploy com Docker (Recomendado)

### Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Porta 3000 disponível
- Porta 3306 disponível (MySQL)

### Passos para Deploy

#### 1. Clone e Checkout
```bash
git clone https://github.com/Lucchesy0/salao-crm.git
cd salao-crm
git checkout feature/improve-ui-and-permissions
```

#### 2. Build e Iniciar
```bash
# Build da imagem e iniciar containers
docker-compose up -d --build

# Acompanhar logs
docker-compose logs -f
```

#### 3. Verificar Status
```bash
# Ver containers rodando
docker-compose ps

# Deve mostrar:
# - salao-mysql (healthy)
# - salao-app (healthy)
```

#### 4. Acessar Aplicação
```
http://localhost:3000
```

### ⚙️ Configurações Opcionais

#### Mudar Porta da Aplicação
```yaml
# docker-compose.yml
services:
  app:
    ports:
      - "8080:3000"  # Mudar 8080 para porta desejada
```

#### Mudar Senhas do MySQL
```yaml
# docker-compose.yml
services:
  db:
    environment:
      MYSQL_ROOT_PASSWORD: SUA_SENHA_AQUI
      MYSQL_PASSWORD: SUA_SENHA_AQUI
  app:
    environment:
      DB_PASSWORD: SUA_SENHA_AQUI
```

### 🛠️ Comandos Úteis

```bash
# Parar containers
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Rebuild forçado
docker-compose build --no-cache
docker-compose up -d

# Ver logs de um serviço específico
docker-compose logs -f app
docker-compose logs -f db

# Executar comandos dentro do container
docker-compose exec app sh
docker-compose exec db mysql -u root -p

# Reiniciar apenas um serviço
docker-compose restart app
```

---

## 💻 Deploy Manual (Sem Docker)

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### Passos

#### 1. Preparar Banco de Dados
```sql
-- Conectar no MySQL
mysql -u root -p

-- Criar banco
CREATE DATABASE salao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário (opcional)
CREATE USER 'salao_user'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON salao.* TO 'salao_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env
cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha123
DB_DATABASE=salao
EOF
```

#### 3. Instalar e Build
```bash
# Instalar dependências
npm install

# Build do frontend
npm run build

# Testar
NODE_ENV=production npm start
```

#### 4. Usar PM2 para Processo Contínuo
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name salao-crm -i max

# Ver status
pm2 status

# Ver logs
pm2 logs salao-crm

# Reiniciar
pm2 restart salao-crm

# Parar
pm2 stop salao-crm

# Deletar
pm2 delete salao-crm

# Salvar configuração
pm2 save
pm2 startup
```

---

## ☁️ Deploy em Cloud

### AWS EC2

```bash
# 1. Conectar ao EC2
ssh -i sua-chave.pem ubuntu@seu-ip

# 2. Instalar Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# 3. Clone e deploy
git clone https://github.com/Lucchesy0/salao-crm.git
cd salao-crm
git checkout feature/improve-ui-and-permissions
docker-compose up -d --build

# 4. Configurar firewall
sudo ufw allow 3000/tcp
sudo ufw enable
```

### Heroku

```bash
# 1. Login
heroku login

# 2. Criar app
heroku create salao-crm

# 3. Adicionar MySQL
heroku addons:create jawsdb:kitefin

# 4. Deploy
git push heroku feature/improve-ui-and-permissions:main

# 5. Ver logs
heroku logs --tail
```

### Digital Ocean

```bash
# Usar Docker Droplet
# 1. Criar droplet com Docker pré-instalado
# 2. SSH no droplet
# 3. Seguir passos do AWS EC2
```

---

## 🔒 Segurança

### Produção Checklist

- [ ] Mudar senhas padrão do MySQL
- [ ] Mudar credenciais de usuários no código
- [ ] Usar variáveis de ambiente para senhas
- [ ] Configurar HTTPS (SSL/TLS)
- [ ] Configurar firewall
- [ ] Fazer backup do banco de dados
- [ ] Monitorar logs
- [ ] Limitar tentativas de login
- [ ] Implementar rate limiting

### Configurar HTTPS com Nginx

```nginx
# /etc/nginx/sites-available/salao
server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Monitoramento

### Health Checks

```bash
# Verificar saúde da aplicação
curl http://localhost:3000/

# Deve retornar:
# {"mensagem":"🚀 Salão funcionando!"}
```

### Logs

```bash
# Docker
docker-compose logs -f --tail=100

# PM2
pm2 logs salao-crm --lines 100

# Sistema
sudo journalctl -u salao-crm -f
```

---

## 🔄 Atualizações

### Atualizar Aplicação (Docker)

```bash
# 1. Fazer backup do banco
docker-compose exec db mysqldump -u root -psenha123 salao > backup.sql

# 2. Pull das atualizações
git pull origin feature/improve-ui-and-permissions

# 3. Rebuild
docker-compose down
docker-compose up -d --build

# 4. Verificar
docker-compose logs -f
```

### Atualizar Aplicação (PM2)

```bash
# 1. Fazer backup
mysqldump -u root -p salao > backup.sql

# 2. Pull
git pull origin feature/improve-ui-and-permissions

# 3. Rebuild
npm install
npm run build

# 4. Reiniciar
pm2 restart salao-crm
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs
docker-compose logs app

# Verificar portas
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3306

# Limpar tudo e reiniciar
docker-compose down -v
docker-compose up -d --build
```

### Erro de conexão com MySQL

```bash
# Verificar se MySQL está rodando
docker-compose ps

# Testar conexão
docker-compose exec db mysql -u root -psenha123

# Ver logs do MySQL
docker-compose logs db
```

### Build falha

```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 💾 Backup e Restore

### Backup

```bash
# Docker
docker-compose exec db mysqldump -u root -psenha123 salao > backup-$(date +%Y%m%d).sql

# Local
mysqldump -u root -p salao > backup-$(date +%Y%m%d).sql
```

### Restore

```bash
# Docker
docker-compose exec -T db mysql -u root -psenha123 salao < backup.sql

# Local
mysql -u root -p salao < backup.sql
```

### Backup Automático (Cron)

```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 3h da manhã
0 3 * * * cd /caminho/do/projeto && docker-compose exec -T db mysqldump -u root -psenha123 salao > backups/backup-$(date +\%Y\%m\%d).sql
```

---

**Deploy realizado com sucesso!** 🎉
