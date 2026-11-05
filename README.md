# 🤖 Guia de Configuração e Inicialização do Bot

Este guia explica como configurar o ambiente, utilizar o ficheiro de configuração e iniciar o bot no teu servidor do Discord.

---

## ⚙️ 1. Configuração do Arquivo de Config

O bot precisa de um ficheiro de configuração localizado na pasta `src/configs/` para funcionar corretamente.

1. Na pasta `src/configs/`, cria um arquivo chamado `config.json` (podes basear-te num modelo `ex.config.json`).
2. Preenche as informações necessárias seguindo a estrutura abaixo:

```json
{
    // Configuração obrigatória para iniciar
    "token": "token-do-bot",
    "prefix": "prefixo-para-comandos-em-chat",
    // Para os slash commands funcionarem no servidor sem tempo de espera
    "guild_id": "id-do-servidor",
    "client_id": "client-id-do-bot"
}
```

- **`token`**: O token secreto do teu bot obtido no [Discord Developer Portal](https://discord.com/developers/applications).
- **`prefix`**: O prefixo utilizado para os comandos de chat tradicionais (ex: `?` ou `!`).
- **`guild_id`**: O ID do teu servidor (guilda) do Discord para o registo instantâneo de Slash Commands.
- **`client_id`**: O ID da aplicação (Client ID) do teu bot no Discord Developer Portal.

---

## 📦 2. Instalação de Dependências

Antes de iniciar o bot pela primeira vez, certifica-te de que tens o [Node.js](https://nodejs.org/) instalado e executa o comando de instalação no terminal, na raiz do projeto:

### Usando o NPM:

```bash
npm install
```

### Usando o Yarn:

```bash
yarn install
```

---

## 🚀 3. Como Iniciar o Bot

Podes iniciar o bot utilizando o gestor de pacotes da tua preferência:

### Usando NPM

Para ligar o bot normalmente:

```bash
npm start
```

### Usando Yarn

Para ligar o bot normalmente:

```bash
yarn start
```

> **Dica de Desenvolvimento:** Se quiseres que o bot reinicie automaticamente sempre que alterares algum ficheiro do código, podes utilizar o modo de desenvolvimento:
>
> - Com npm: `npm run dev`
> - Com yarn: `yarn dev`
