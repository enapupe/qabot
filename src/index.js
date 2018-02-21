const SlackBot = require('slackbots')

const git = require('./git')
const formatAsCode = require('./utils/format-as-code')
const getBranchFromMessage = require('./utils/get-branch-from-message')
const buildStatusMessage = require('./utils/build-status-message')

const SLACK_KEY = process.env.SLACK_KEY || 'xoxb-317873788357-c4UBADBFOlT076O4lz0hVNk2'

const bot = new SlackBot({
  token: SLACK_KEY,
  name: 'qabot',
})

const params = {
  icon_emoji: ':robot_face:',
}

const QUEUE = []

const sendMessage = (message) => bot.postMessageToChannel('random', message, params)
const isMessageForMe = (data, bot) =>
  data.type === 'message' && data.text.includes(`<@${bot.self.id}>`)

const dumpStatus = async () => {
  if (QUEUE.length) {
    sendMessage(buildStatusMessage(QUEUE))
    return
  }
  sendMessage('Nothing to report.')
}

const deployTopQueueEntry = async () => {
  const { branch } = QUEUE[0]
  sendMessage(`pushing branch \`${branch}\``)
  try {
    const ref = await git(branch)
    sendMessage(`successfully pushed branch \`${branch} (${ref})\``)
  } catch (e) {
    console.warn(e)
    sendMessage(`Failed to push branch: ${formatAsCode(e.message)}`)
    QUEUE.shift()
  }
}

const processDeployRequest = async (branch, user) => {
  if (!QUEUE.length) {
    const queueEntry = { branch, user }
    QUEUE.push(queueEntry)
    return deployTopQueueEntry()
  }
  sendMessage(
    `queueing branch ${formatAsCode(branch)} after ${formatAsCode(QUEUE.length)} branches`
  )
  QUEUE.push({ branch, user })
}

const removeBranchFromQueue = (branch, userInfo) => {
  const queueEntry = QUEUE.find((q) => q.branch === branch)
  if (queueEntry) {
    if (queueEntry.user.id === userInfo.id) {
      QUEUE.splice(QUEUE.indexOf(queueEntry), 1)
      sendMessage(`removed branch ${formatAsCode(branch)} from queue`)
      return
    }
  }
  sendMessage(`:heavy_exclamation_mark: branch ${formatAsCode(branch)} nout found in queue`)
}

const deploy = (data) => {
  if (isMessageForMe(data, bot) && data.text.includes('deploy')) {
    const branch = getBranchFromMessage(data.text)
    if (branch) {
      const userInfo = bot.users.find((u) => u.id === data.user)
      processDeployRequest(branch, userInfo)
    }
  }
}

const release = (data) => {
  if (isMessageForMe(data, bot) && data.text.includes('release')) {
    const branch = getBranchFromMessage(data.text)
    if (branch) {
      const userInfo = bot.users.find((u) => u.id === data.user)
      removeBranchFromQueue(branch, userInfo)
      deployTopQueueEntry()
    }
  }
}

const status = (data) => {
  if (isMessageForMe(data, bot) && data.text.includes('status')) {
    return dumpStatus()
  }
}

bot.on('start', () => {
  sendMessage('Initializing...')
})
bot.on('message', deploy)
bot.on('message', release)
bot.on('message', status)
