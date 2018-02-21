// Fail tests on any warning
console.error = (message) => {
  throw new Error(message)
}

global.bot = {
  getUsers: () =>
    new Promise((resolve) =>
      resolve({
        members: [
          {
            id: 'U9BMJNVFW',
            team_id: 'T9B5YHFUH',
            name: 'iacamigevaerd',
            deleted: false,
            color: '9f69e7',
            real_name: 'Iacami',
            tz: 'America/Sao_Paulo',
            tz_label: 'Brasilia Time',
            tz_offset: -10800,
            profile: [Object],
            is_admin: true,
            is_owner: true,
            is_primary_owner: true,
            is_restricted: false,
            is_ultra_restricted: false,
            is_bot: false,
            updated: 1519127453,
            is_app_user: false,
            presence: 'away',
          },
          {
            id: 'U9BRPP6AH',
            team_id: 'T9B5YHFUH',
            name: 'qabot',
            deleted: false,
            color: '4bbe2e',
            real_name: 'qabot',
            tz: 'America/Los_Angeles',
            tz_label: 'Pacific Standard Time',
            tz_offset: -28800,
            profile: [Object],
            is_admin: false,
            is_owner: false,
            is_primary_owner: false,
            is_restricted: false,
            is_ultra_restricted: false,
            is_bot: true,
            updated: 1519127505,
            is_app_user: false,
            presence: 'away',
          },
          {
            id: 'USLACKBOT',
            team_id: 'T9B5YHFUH',
            name: 'slackbot',
            deleted: false,
            color: '757575',
            real_name: 'slackbot',
            tz: null,
            tz_label: 'Pacific Standard Time',
            tz_offset: -28800,
            profile: [Object],
            is_admin: false,
            is_owner: false,
            is_primary_owner: false,
            is_restricted: false,
            is_ultra_restricted: false,
            is_bot: false,
            updated: 0,
            is_app_user: false,
            presence: 'active',
          },
        ],
      })
    ),
}
