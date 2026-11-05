const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
    client.slashCommands = new Collection();
    client.prefixCommands = new Collection();
    client.commandCategories = new Map();

    const pastaComandosPath = path.join(__dirname, "../commands");
    const categorias = fs.readdirSync(pastaComandosPath);

    categorias.forEach((categoria) => {
        const caminhoCategoria = path.join(pastaComandosPath, categoria);

        if (fs.statSync(caminhoCategoria).isDirectory()) {
            const arquivos = fs
                .readdirSync(caminhoCategoria)
                .filter((file) => file.endsWith(".js"));

            // Inicializa a lista da categoria no client
            if (!client.commandCategories.has(categoria)) {
                client.commandCategories.set(categoria, []);
            }

            arquivos.forEach((arquivo) => {
                const comando = require(path.join(caminhoCategoria, arquivo));
                comando.category = categoria; // Injeta a categoria no objeto do comando

                if (comando.data && comando.executeSlash) {
                    client.slashCommands.set(comando.data.name, comando);
                }

                if (comando.name && comando.executePrefix) {
                    client.prefixCommands.set(comando.name, comando);

                    if (comando.aliases && Array.isArray(comando.aliases)) {
                        comando.aliases.forEach((alias) => {
                            client.prefixCommands.set(alias, comando);
                        });
                    }
                }

                // Adiciona o comando na categoria correspondente no client
                client.commandCategories.get(categoria).push(comando);

                console.log(`[Comando Carregado] ${arquivo} (${categoria})`);
            });
        }
    });
};
