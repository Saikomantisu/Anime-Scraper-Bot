const { prefix } = require('./config.json')

module.exports = (message, command, reply) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.toLowerCase().slice(prefix.length).split(/ +/)
  const cmd = args.shift()

  if (cmd === command) {
    reply(message, args)
  }
}
