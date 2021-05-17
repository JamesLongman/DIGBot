import {Message, MessageEmbed, TextChannel} from 'discord.js';

export function role(id: string): string {
    return `<@&${id}>`;
}

export function channel(id: string): string {
    return `<#${id}>`;
}

export function member(id: string): string {
    return `<@${id}>`;
}

export async function silentMention(
    channel: TextChannel,
    content: string | MessageEmbed,
    tempContent: string | MessageEmbed = 'One sec, I am not trying to mention',
): Promise<Message> {
    const message = await channel.send(tempContent);
    await message.edit(message);

    channel.send('', )
    return message;
}
