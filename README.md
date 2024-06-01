# Instruções de desenvolvimento

## Pré-requisitos	
- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Image-Postgres](https://hub.docker.com/_/postgres)

## Instalação

### Clone o repositório
```bash
git clone https://github.com/vinicivs-rocha/db-crud-challenge.git
```

### Instale as dependências
```bash
cd db-crud-challenge
bun install
```

### Inicie o banco de dados
1. Configure o arquivo `.env` com as variáveis de ambiente necessárias;
```bash
DB_HOST=localhost
DB_PORt=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=postgres
```
2. Crie um arqivo ``docker-compose.yml`` que orquestre um banco de dados PostgreSQL, na sua última versão (conforme suportado pelas imagens disponibilizadas no [DockerHub](https://hub.docker.com/_/postgres)).
```bash
version: '3'

services:
  db:
    image: postgres:latest
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:${DB_PORT}"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

3. Execute o comando `docker compose up -d` para iniciar o banco de dados.

### Acessar e Criar as tabelas no banco de dados postgres no Docker
1. Para acessar o banco de dados postgres e necessário utilizar o seguinte comando no terminal:

```bash
docker exec -it CONTAINER_ID psql -U postgres -d postgres 
```
Obs: E necessário saber o id do container usando o: `docker ps` 

2.	Criar as tabelas:
```bash
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP
);
```
```bash
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  post_id INT NOT NULL,
  CONSTRAINT fk_post
    FOREIGN KEY(post_id) 
    REFERENCES posts(id)
);
```
## Inicie o servidor de desenvolvimento
```bash
bun dev
```

**Abra http://localhost:3000/ com o navegador para testar a aplicação.**
bun dev
```

**Abra http://localhost:3000/ com o navegador para testar a aplicação.**
