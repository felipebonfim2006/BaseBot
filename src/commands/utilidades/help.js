const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    // Slash Command
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Mostra a lista de comandos disponíveis no bot."),

    // Comando por prefixo
    name: "help",
    aliases: ["ajuda", "comandos"],
    description: "Lista os comandos disponiveis.",

    async executeSlash(interaction) {
        await this.sendHelp(interaction);
    },

    async executePrefix(message) {
        await this.sendHelp(message);
    },

    async sendHelp(context) {
        const client = context.client;
        const categories = client.commandCategories;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🤖 Painel de Ajuda")
            .setDescription("Aqui estão todos os comandos disponíveis no bot:")
            .setTimestamp();

        // Agrupa os comandos por categoria
        if (categories && categories.size > 0) {
            for (const [categoria, comandos] of categories.entries()) {
                const nomeFormatado =
                    categoria.charAt(0).toUpperCase() + categoria.slice(1);

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
            // Fallback para as collections gerais do client
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

        return context.reply({ embeds: [embed] });
    },
};
