import { RegisterComponent } from '../../lib/pairity'

import TeamItem from './teamItem'
import TeamSubItem from './teamSubItem'
import TeamSubListItem from './teamSubListItem'
import OrganizationItem from './organizationItem'

// ----------------------------- Teams ------------------------------
RegisterComponent('TeamItem', TeamItem)
RegisterComponent('TeamSubItem', TeamSubItem)
RegisterComponent('TeamSubListItem', TeamSubListItem)

// ----------------------------- Teams ------------------------------
RegisterComponent('OrganizationItem', OrganizationItem)
