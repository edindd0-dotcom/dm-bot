const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
});

client.once("ready", () => {
  console.log(`${client.user.tag} aktif!`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "dm") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Sadece admin kullanabilir.");

    const text = args.join(" ");
    if (!text) return message.reply("❌ Mesaj yaz.");

    await message.reply("📢 Duyuru gönderiliyor...");

    const members = await message.guild.members.fetch();

    let sent = 0;
    let failed = 0;

    for (const member of members.values()) {
      if (member.user.bot) continue;

      try {
        await member.send(text);
        sent++;
      } catch (err) {
        failed++;
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    message.channel.send(`✅ Gönderildi: ${sent}\n❌ Gönderilemedi: ${failed}`);
  }
});

client.login(config.token);
