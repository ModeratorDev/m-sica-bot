//////////////////// EVENTO DE ZEEW ////////////////////


const Discord = require('discord.js'),
    DisTube = require('distube'),
    client = new Discord.Client(),
    config = {
        prefix: "!",
        token: process.env.TOKEN || "Your Discord Token"
    };


const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: false });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    client.user.setPresence({
    activity: {
        name: "SAM",
        type: "WATCHING",  
            },
    status: "online"  
});
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "play")
        distube.play(message, args.join(" "));

    if (["repeat", "loop"].includes(command))
        distube.setRepeatMode(message, parseInt(args[0]));

    if (command == "stop") {
        distube.stop(message);
        message.channel.send("Se detuvo la musica");
    }

    if (command == "skip")
        distube.skip(message);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Cola actual:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Filtro de cola actual: " + (filter || "desactivado"));
    }
});

const status = (queue) => `Volumen: \`${queue.volume}%\` | filtro: \`${queue.filter || "desactivado"}\` | bucle: \`${queue.repeatMode ? queue.repeatMode == 2 ? "Toda la cola" : "Esta canción" : "desactivado"}\` | Reproducción automática: \`${queue.autoplay ? "activada" : "apagada"}\``;

distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Reproduciendo \`${song.name}\` - \`${song.formattedDuration}\`\npedido por: ${song.user}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `se añadio ${song.name} - \`${song.formattedDuration}\` a la cola por ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `reproduciendo \`${playlist.name}\` playlist (${playlist.songs.length} canciones).\npedido po: ${song.user}\nReproduciendo ahora \`${song.name}\` - \`${song.formattedDuration}\``
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `se añadio \`${playlist.name}\` playlist (${playlist.songs.length} canciones) to queue`
    )) 
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Elija una opción de abajo**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Introduzca cualquier otra cosa o espere 60 segundos para cancelar*`)
    }) 
    .on("searchCancel", (message) => message.channel.send(`Búsqueda cancelada`))
    .on("error", (message, e) => {
        console.error(e) 
    });

client.login(process.env.TOKEN).then(() => {
  console.log(`Prendio como: ${client.user.tag}`)
})

//////////////////// FIN DE ZEEW ////////////////////