const formatAsCode = require('../format-as-code')

const getUserInfo = async (bot, userId) => {
  const allUsers = await bot.getUsers()
  return allUsers.members.find((m) => m.id === userId)
}

const prettyPrintQueueEntry = async (bot, { branch, user }) => {
  const userInfo = await getUserInfo(user)
  console.log(userInfo)
  return formatAsCode(`${branch} (${userInfo.profile.display_name})`)
}

module.exports = prettyPrintQueueEntry
