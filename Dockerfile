# Etapa 1: Build do frontend com Node.js
FROM node:20 AS builder

# Clona o projeto completo (backend + frontend juntos)
RUN git clone https://github.com/alexsanderwilen/financas_pessoais.git /app

# Caminho para o frontend
WORKDIR /app/financas-frontend

# Instala dependências e faz o build (usando --legacy-peer-deps para evitar conflitos)
RUN npm install --legacy-peer-deps && npm run build

# Etapa 2: Backend com Python 3.12
FROM python:3.12-slim

# Instala dependências do sistema
RUN apt-get update && apt-get install -y gcc g++ git

# Cria diretório de trabalho
WORKDIR /app

# Copia todo o projeto (incluindo frontend e backend)
COPY --from=builder /app /app

# Copia os arquivos estáticos do frontend para a pasta do backend
RUN mkdir -p /app/financas-backend/src/static && \
    cp -r /app/financas-frontend/dist/* /app/financas-backend/src/static/

# Instala dependências Python do backend
WORKDIR /app/financas-backend
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expõe a porta do Flask
EXPOSE 5000

# Comando para iniciar o Flask
CMD ["python", "src/main.py"]
