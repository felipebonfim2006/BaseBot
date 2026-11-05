const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
    client.slashCommands = new Collection();
    client.prefixCommands = new Collection();

    const pastaComandosPath = path.join(__dirname, "../commands");
    const categorias = fs.readdirSync(pastaComandosPath);

    categorias.forEach((categoria) => {
        const caminhoCategoria = path.join(pastaComandosPath, categoria);

        if (fs.statSync(caminhoCategoria).isDirectory()) {
            const arquivos = fs
                .readdirSync(caminhoCategoria)
                .filter((file) => file.endsWith(".js"));

            arquivos.forEach((arquivo) => {
                const comando = require(path.join(caminhoCategoria, arquivo));

                // Registra se tiver suporte a Slash
                if (comando.data && comando.executeSlash) {
                    client.slashCommands.set(comando.data.name, comando);
                }

                // Registra se tiver suporte a Prefixo
                if (comando.name && comando.executePrefix) {
                    client.prefixCommands.set(comando.name, comando);

                    // Se houver apelidos (aliases), registra também
                    if (comando.aliases && Array.isArray(comando.aliases)) {
                        comando.aliases.forEach((alias) => {
                            client.prefixCommands.set(alias, comando);
                        });
                    }
                }

                console.log(`[Comando Carregado] ${arquivo} (${categoria})`);
            });
        }
    });
};
