// Dicionário de metadados para padronizar nomes amigáveis, ícones e descrições das categorias
const metaCategory = {
    utilidades: {
        label: "Utilidades",
        emoji: "🛠️",
        description: "Comandos úteis e informações do bot.",
    },
    administracao: {
        label: "Administração do Servidor",
        emoji: "⚙️",
        description: "Ajustes gerais, prefixo e preferências.",
    },
    moderacao: {
        label: "Moderação",
        emoji: "🛡️",
        description: "Ferramentas para gerenciar e moderar o servidor.",
    },
};

// Agrupa os comandos do client em um Map estruturado por categoria
const categoryPerCommand = (client) => {
    const groups = new Map();

    // Retorna um Map vazio caso o client não tenha sido informado
    if (!client) {
        return groups;
    }

    // Resolve os metadados da categoria com base na chave bruta (ex.: nome da pasta)
    const resolveCategoryInfo = (rawCategory) => {
        const key = rawCategory || "Outros";
        const meta = metaCategory[key];

        return {
            key,
            label: meta?.label || key,
            emoji: meta?.emoji || "📁",
            description:
                meta?.description ||
                `Comandos da categoria ${meta?.label || key}.`,
        };
    };

    // Prioriza o Map de categorias já montado pelo command handler
    if (
        client.commandCategories instanceof Map &&
        client.commandCategories.size > 0
    ) {
        // Percorre cada categoria e sua respectiva lista de comandos
        for (const [
            rawCategory,
            commandList,
        ] of client.commandCategories.entries()) {
            const info = resolveCategoryInfo(rawCategory);
            const uniqueCommands = [];
            const seenNames = new Set();

            // Filtra comandos duplicados e extrai informações úteis para o menu /help
            for (const command of commandList) {
                const commandName = command.data?.name || command.name;
                if (!commandName || seenNames.has(commandName)) {
                    continue;
                }
                seenNames.add(commandName);

                // Verifica se o comando possui suporte a Slash Command e/ou Prefix Command
                const hasSlash = Boolean(
                    (command.data && command.executeSlash) ||
                        client.slashCommands?.get(commandName)?.executeSlash,
                );

                const hasPrefix = Boolean(
                    (command.name && command.executePrefix) ||
                        client.prefixCommands?.get(commandName)?.executePrefix,
                );

                uniqueCommands.push({
                    name: commandName,
                    description:
                        command.data?.description ||
                        command.description ||
                        "Descrição não definida.",
                    aliases: Array.isArray(command.aliases)
                        ? command.aliases
                        : [],
                    hasSlash,
                    hasPrefix,
                });
            }

            // Registra ou mescla a categoria no Map usando info.label como chave
            if (uniqueCommands.length > 0) {
                const existing = groups.get(info.label);
                if (existing) {
                    for (const cmd of uniqueCommands) {
                        if (!existing.commands.some((c) => c.name === cmd.name)) {
                            existing.commands.push(cmd);
                        }
                    }
                } else {
                    groups.set(info.label, {
                        key: info.key,
                        label: info.label,
                        emoji: info.emoji,
                        description: info.description,
                        commands: uniqueCommands,
                    });
                }
            }
        }

        // Retorna o Map pronto quando client.commandCategories é utilizado
        return groups;
    }

    // Fallback caso client.commandCategories não esteja populado no client
    const collections = [
        client.slashCommands,
        client.prefixCommands,
    ].filter(Boolean);

    // Percorre as coleções de comandos disponíveis
    for (const collection of collections) {
        for (const command of collection.values()) {
            const commandName = command.data?.name || command.name;
            if (!commandName) continue;

            const info = resolveCategoryInfo(command.category);

            // Cria o grupo da categoria no Map se ele ainda não existir
            if (!groups.has(info.label)) {
                groups.set(info.label, {
                    key: info.key,
                    label: info.label,
                    emoji: info.emoji,
                    description: info.description,
                    commands: [],
                });
            }

            // Adiciona o comando sem duplicar nomes dentro da mesma categoria
            const list = groups.get(info.label).commands;
            if (!list.some((item) => item.name === commandName)) {
                list.push({
                    name: commandName,
                    description:
                        command.data?.description ||
                        command.description ||
                        "Descrição não definida.",
                    aliases: Array.isArray(command.aliases)
                        ? command.aliases
                        : [],
                    hasSlash: Boolean(command.data && command.executeSlash),
                    hasPrefix: Boolean(command.name && command.executePrefix),
                });
            }
        }
    }

    // Retorna o Map consolidado
    return groups;
};

export default {
    categoryPerCommand,
};