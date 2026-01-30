# Estágio 1: Build do frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (usar install ao invés de ci)
RUN npm install

# Copiar código fonte
COPY . .

# Build do frontend com Vite
RUN npm run build

# Estágio 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm install --omit=dev

# Copiar server e build do frontend
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Variável de ambiente para produção
ENV NODE_ENV=production

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Executar servidor
CMD ["node", "server.js"]
