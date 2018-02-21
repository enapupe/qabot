const BRANCH_REGEX = /`[\w-/_]+`/g

const getBranchFromMessage = (content = '') => {
  if (!content.match(BRANCH_REGEX)) {
    return false
  }
  const matches = content.match(BRANCH_REGEX)
  if (matches.length === 1) {
    return matches[0].replace(/`/g, '')
  }
  return false
}

module.exports = getBranchFromMessage
