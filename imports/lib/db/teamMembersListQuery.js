import { TeamMembers } from '../pairity'

export default TeamMembers.createQuery('teamMembersListQuery', {
    $filter({ filters, options, params }) {
        filters.teamId = params.teamId
    },
    _id: 1,
    teamId: 1,
    organizationId: 1,
    userId: 1,
    isAdmin: 1,
    isPresent: 1,
    isGuest: 1,
    team: {
        name: 1
    },
    organization: {
        name: 1
    },
    user: {
        username: 1,
        emails: 1
    }
})
