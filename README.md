# 🤖 BaseBot

Base para um bot de Discord com `discord.js`, comandos por prefixo, Slash Commands e persistência no MongoDB.

---

## 📋 Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior.
- Um servidor MongoDB acessível (local ou na nuvem).
- Uma aplicação criada no [Discord Developer Portal](https://discord.com/developers/applications).

---

## ⚙️ 1. Configuração

Na pasta `src/configs/`, copie o arquivo `ex.config.json` para `config.json` e preencha os valores:

```bash
cp src/configs/ex.config.json src/configs/config.json
```

```json
{
    "token": "seu-token-do-bot",
    "prefix": "?",
    "guild_id": "id-do-servidor",
    "client_id": "id-do-cliente-do-bot",
    "mongo_uri": "uri-do-mongodb"
}
```

| Campo | Descrição |
| --- | --- |
| `token` | Token do bot, disponível na aba **Bot** do Discord Developer Portal. |
| `prefix` | Prefixo dos comandos enviados pelo chat (ex.: `?` ou `!`). |
| `guild_id` | ID do servidor onde os Slash Commands serão registrados imediatamente. |
| `client_id` | ID da aplicação, disponível na aba **General Information** do Discord Developer Portal. |
| `mongo_uri` | String de conexão do MongoDB usada para salvar os dados do bot. |

> **Importante:** o arquivo `config.json` contém dados sensíveis e está listado no `.gitignore`. Nunca publique seu token ou suas credenciais do MongoDB.

---

## 📦 2. Instalação

Abra o terminal na raiz do projeto e instale as dependências:

### Usando NPM

```bash
npm install
```

### Usando Yarn

```bash
yarn install
```

---

## 🚀 3. Como iniciar o bot

### Usando NPM

```bash
npm start
```

### Usando Yarn

```bash
yarn start
```

### Modo de desenvolvimento

Para reiniciar o bot automaticamente quando um arquivo for alterado:

```bash
npm run dev
# ou
yarn dev
```

---

## 📁 Estrutura do projeto

```text
src/
├── commands/       # Comandos separados por categoria
├── configs/        # config.json (local) e ex.config.json (modelo)
├── database/       # Conexão com o MongoDB e modelos
├── events/         # Eventos do cliente Discord
└── handlers/       # Carregadores de comandos e eventos
```
