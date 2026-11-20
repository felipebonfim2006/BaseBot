import {
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import GuildModel from "../../database/models/GuildModel.js";
import categoryHelper from "../../functions/categoryHelper.js";
import "dotenv/config";

// Busca o prefixo do servidor no MongoDB ou utiliza o fallback padrão
async function resolvePrefix(guildId) {
    const fallbackPrefix = process.env.PREFIX || "?";
    if (!guildId) return fallbackPrefix;

    // Consulta o documento da guild usando o campo guildID
    const guildData = await GuildModel.findOne({ guildID: guildId }).lean();
    return guildData?.prefix || fallbackPrefix;
}

// Monta a embed inicial exibindo as categorias disponíveis
function buildInitialEmbed(categoriesMap, prefix) {
    const categories = [...categoriesMap.values()];

    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("📖 Menu de ajuda")
        .setDescription(
            [
                "Selecione uma categoria abaixo para ver apenas os comandos dela.",
                `Prefixo atual: \`${prefix}\``,
            ].join("\n"),
        )
        .addFields(
            categories.length > 0
                ? categories.map((cat) => ({
                      name: `${cat.emoji} ${cat.label}`,
                      value: cat.description,
                      inline: false,
                  }))
                : [
                      {
                          name: "Nenhuma categoria",
                          value: "Não há comandos carregados no momento.",
                          inline: false,
                      },
                  ],
        );
}

// Monta a embed contendo apenas os comandos da categoria selecionada
function buildCategoryEmbed(categoryData, prefix) {
    // Formata cada comando com suas formas de execução (slash e/ou prefixo)
    const commandLines = categoryData.commands.map((cmd) => {
        const usages = [];
        if (cmd.hasSlash) usages.push(`\`/${cmd.name}\``);
        if (cmd.hasPrefix) usages.push(`\`${prefix}${cmd.name}\``);

        const usageLabel = usages.length > 0 ? usages.join(" / ") : `\`${cmd.name}\``;
        return `• ${usageLabel} — ${cmd.description}`;
    });

    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${categoryData.emoji} ${categoryData.label}`)
        .setDescription(
            commandLines.length > 0
                ? commandLines.join("\n")
                : "Nenhum comando encontrado nesta categoria.",
        )
        .setFooter({ text: `Prefixo: ${prefix}` });
}

// Cria a linha de componentes com o menu suspenso de categorias
function buildSelectMenu(categoriesMap, customId, selectedLabel = null) {
    // Limita a 25 opções devido ao limite máximo do Discord para select menus
    const options = [...categoriesMap.values()].slice(0, 25).map((cat) =>
        new StringSelectMenuOptionBuilder()
            .setLabel(cat.label.slice(0, 100))
            .setValue(cat.label.slice(0, 100))
            .setDescription(cat.description.slice(0, 100))
            .setEmoji(cat.emoji)
            .setDefault(selectedLabel === cat.label),
    );

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder("Escolha uma categoria...")
        .addOptions(options);

    return new ActionRowBuilder().addComponents(selectMenu);
}

// Executa o fluxo do menu de ajuda para slash command ou comando por prefixo
async function runHelpMenu({ client, authorId, guildId, sendMessage, editMessage }) {
    const prefix = await resolvePrefix(guildId);

    // Agrupa os comandos por categoria sem duplicatas via helper
    const categoriesMap = categoryHelper.categoryPerCommand(client);

    // Gera um customId único por execução para isolar o collector
    const customId = `help_select_${authorId}_${Date.now()}`;

    const initialEmbed = buildInitialEmbed(categoriesMap, prefix);
    const rows =
        categoriesMap.size > 0
            ? [buildSelectMenu(categoriesMap, customId)]
            : [];

    const sentMessage = await sendMessage({
        embeds: [initialEmbed],
        components: rows,
    });

    // Encerra caso não existam categorias carregadas
    if (categoriesMap.size === 0) return;

    // Cria o collector para escutar mudanças no menu suspenso por 2 minutos
    const collector = sentMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.customId === customId,
        time: 120_000,
    });

    // Atualiza a embed exibindo somente os comandos da categoria escolhida
    collector.on("collect", async (interaction) => {
        // Impede que outros usuários alterem o menu de quem executou o comando
        if (interaction.user.id !== authorId) {
            await interaction.reply({
                content: "Apenas quem executou o comando pode usar este menu.",
                ephemeral: true,
            });
            return;
        }

        const chosenLabel = interaction.values[0];
        const categoryData = categoriesMap.get(chosenLabel);

        // Ignora caso a categoria não seja encontrada no Map
        if (!categoryData) return;

        const categoryEmbed = buildCategoryEmbed(categoryData, prefix);
        const updatedRow = buildSelectMenu(categoriesMap, customId, chosenLabel);

        await interaction.update({
            embeds: [categoryEmbed],
            components: [updatedRow],
        });
    });

    // Desabilita o menu ao expirar o tempo do collector
    collector.on("end", async () => {
        const disabledRow = buildSelectMenu(categoriesMap, customId);
        disabledRow.components[0].setDisabled(true);

        await editMessage({ components: [disabledRow] }).catch(() => {});
    });
}

export default {
    // Configuração do Slash Command (Estrutura enviada para a API do Discord)
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Retorna com o menu de ajuda."),

    // Configurações do comando por prefixo (Nome principal, aliases e descrição)
    name: "help",
    aliases: ["ajuda", "h"],
    description: "Retorna com o menu de ajuda.",

    // Função executada quando o comando é acionado via Slash Command (/)
    async executeSlash(interaction, client) {
        let replyMessage = null;

        await runHelpMenu({
            client,
            authorId: interaction.user.id,
            guildId: interaction.guild?.id,
            sendMessage: async (payload) => {
                const response = await interaction.reply({
                    ...payload,
                    fetchReply: true,
                });
                replyMessage = response;
                return replyMessage;
            },
            editMessage: (payload) =>
                replyMessage
                    ? replyMessage.edit(payload)
                    : interaction.editReply(payload),
        });
    },

    // Função executada quando o comando é acionado via prefixo
    async executePrefix(message, args, client) {
        let sentMessage = null;

        await runHelpMenu({
            client,
            authorId: message.author.id,
            guildId: message.guild?.id,
            sendMessage: async (payload) => {
                sentMessage = await message.channel.send(payload);
                return sentMessage;
            },
            editMessage: (payload) =>
                sentMessage ? sentMessage.edit(payload) : Promise.resolve(),
        });
    },
};