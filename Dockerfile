# Etapa 1: Build do frontend com Node.js
FROM node:20 AS builder

# Clona o projeto completo (com backend e frontend)
RUN git clone https://github.com/alexsanderwilen/financas_pessoais.git /app

# Caminho para o frontend
WORKDIR /app/financas-frontend

# Instala dependências do React e faz build com Vite
RUN npm install --legacy-peer-deps && npm run build

# Etapa 2: Backend com Python 3.12
FROM python:3.12-slim

# Instala dependências do sistema
RUN apt-get update && apt-get install -y gcc g++ git

# Cria diretório da aplicação
WORKDIR /app

# Copia o projeto completo da etapa anterior
COPY --from=builder /app /app

# Copia os arquivos do frontend (build) para o backend/static
RUN cp -r /app/financas-frontend/dist/* /app/financas-backend/src/static/

# Instala as dependências do backend
WORKDIR /app/financas-backend
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expõe a porta do Flask
EXPOSE 5000

# Comando para iniciar o Flask
CMD ["python", "src/main.py"]
