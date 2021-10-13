const DJS = require('discord.js')
const request = require('request')

const { TOKEN, prefix, embed_color } = require('./config.json')
const command_handler = require('./handler.js')

const client = new DJS.Client()

client.on('ready', clinet => {
  console.log(`${client.user.tag} is succsufully connected to discord`)
})

client.on('message', message => {

  command_handler(message, 'ping', msg => {
    msg.channel.send('Pong!')
    return
  })

  command_handler(message, 'waifu', msg => {
    request('https://api.waifu.pics/sfw/waifu', async (error, response, body) => {
      const pics = JSON.parse(body)
      
      const embed = new DJS.MessageEmbed()
        .setImage(pics.url)
        .setColor(embed_color)

      const emojies = ['💗', '💓', '💖']
      const random = Math.floor(Math.random() * emojies.length)

      const sended_embed = await msg.channel.send(embed)
      sended_embed.react(emojies[random])
      return
    })
  })

  command_handler(message, 'anime', (msg, args) => {
    const text = args.join(' ')

    request(`https://api.jikan.moe/v3/search/anime?q=${text}&limit=1`, (error, response, body) => {
      try {
        var { title, image_url, score, rated, synopsis, start_date, end_date, type, episodes, url } = JSON.parse(body).results[0]
      } catch {
        return msg.reply('`API ERROR TRY LATTER`')
      }

      try {
        var startDate = start_date.split('T')[0]
        var endDate = end_date.split('T')[0]
      } catch (error) {
        endDate = 'Ongoing'
        startDate = 'Ongoing'
      }
        
      const embed = new DJS.MessageEmbed() 
        .setTitle(title)
        .setURL(url)
        .setThumbnail(image_url)
        .setDescription(synopsis)
        .setColor(embed_color)
        .addFields(
            { name: 'Score', value: score, inline: true },
            { name: 'Rated', value: rated, inline: true },
            { name: 'Episodes', value: episodes, inline: true },
            { name: 'Type', value: type, inline: true },
            { name: 'Start Date', value: startDate, inline: true },
            { name: 'End Date', value: endDate, inline: true },
          )
        .setFooter(`Requested by ${msg.author.tag}`)

      msg.channel.send(embed)
      return
    })
  })
})

client.login(TOKEN)
