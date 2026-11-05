const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    // Configuração para Slash Command (opcional)
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Mostra a lista de comandos disponíveis no bot."),

    // Configuração para Prefixo (opcional)
    name: "help",
    aliases: ["ajuda", "comandos"],

    // Execução via Slash
    async executeSlash(interaction) {
        await this.sendHelp(interaction, true);
    },

    // Execução via Prefixo
    async executePrefix(message, args) {
        await this.sendHelp(message, false);
    },

    // Função central que monta e envia o Embed
    async sendHelp(context, isSlash) {
        const client = context.client;
        const categories = client.commandCategories;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🤖 Painel de Ajuda")
            .setDescription("Aqui estão todos os comandos disponíveis no bot:")
            .setTimestamp();

        // Se o client possuir as categorias estruturadas
        if (categories && categories.size > 0) {
            for (const [categoria, comandos] of categories.entries()) {
                const nomeFormatado =
                    categoria.charAt(0).toUpperCase() + categoria.slice(1);

                // Formata a lista de comandos da categoria
                const listaComandos = comandos
                    .map((cmd) => {
                        const nome = cmd.data?.name || cmd.name;
                        const desc = cmd.description || "Sem descrição";
                        return `\`/${nome}\` - ${desc}`;
                    })
                    .join("\n");

                embed.addFields({
                    name: `📁 ${nomeFormatado}`,
                    value: listaComandos || "Nenhum comando.",
                    inline: false,
                });
            }
        } else {
            // Fallback caso pegue direto das collections gerais
            const comandos = client.slashCommands || client.prefixCommands;
            let lista = "";
            comandos.forEach((cmd) => {
                const nome = cmd.data?.name || cmd.name;
                const desc = cmd.description || "Sem descrição";
                lista += `\`/${nome}\` - ${desc}\n`;
            });

            embed.addFields({
                name: "📜 Comandos",
                value: lista || "Nenhum comando encontrado.",
            });
        }

        // Responde de acordo com o tipo de invocação (Slash ou Prefixo)
        return isSlash
            ? context.reply({ embeds: [embed] })
            : context.reply({ embeds: [embed] });
    },
};
