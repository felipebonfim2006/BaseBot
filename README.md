# 🤖 Guia de Configuração e Inicialização do Bot

Este guia explica como configurar o ambiente, preencher o arquivo de configuração e iniciar o bot no seu servidor do Discord.

---

## ⚙️ 1. Configuração do Arquivo de Configuração

Para funcionar corretamente, o bot precisa de um arquivo de configuração localizado na pasta `src/configs/`.

1. Dentro da pasta `src/configs/`, crie um arquivo chamado `config.json` (você pode usar o arquivo `ex.config.json` como modelo).
2. Preencha as informações necessárias seguindo a estrutura abaixo:

```json
{
    "token": "token-do-bot",
    "prefix": "prefixo-dos-comandos",
    "guild_id": "id-do-servidor",
    "client_id": "id-do-cliente-do-bot"
}
```

- **`token`**: Token secreto do seu bot, obtido no [Discord Developer Portal](https://discord.com/developers/applications).
- **`prefix`**: Prefixo utilizado nos comandos tradicionais enviados pelo chat (ex.: `?` ou `!`).
- **`guild_id`**: ID do seu servidor do Discord. Ele é utilizado para registrar os Slash Commands diretamente no servidor, sem precisar esperar pela atualização global.
- **`client_id`**: ID da aplicação (Client ID) do seu bot, disponível no Discord Developer Portal.

---

## 📦 2. Instalação das Dependências

Antes de iniciar o bot pela primeira vez, verifique se o [Node.js](https://nodejs.org/) está instalado. Em seguida, abra o terminal na pasta raiz do projeto e execute um dos comandos abaixo:

### Usando NPM

```bash
npm install
```

### Usando Yarn

```bash
yarn install
```

---

## 🚀 3. Como Iniciar o Bot

Você pode iniciar o bot utilizando o gerenciador de pacotes de sua preferência:

### Usando NPM

Para iniciar o bot normalmente, execute:

```bash
npm start
```

### Usando Yarn

Para iniciar o bot normalmente, execute:

```bash
yarn start
```

> **Dica para desenvolvimento:** Se quiser que o bot reinicie automaticamente sempre que algum arquivo do código for alterado, utilize o modo de desenvolvimento:
>
> - Com NPM: `npm run dev`
> - Com Yarn: `yarn dev`
