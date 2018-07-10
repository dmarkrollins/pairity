import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Meteor from 'meteor/meteor'
import { Pairity, OrganizationMembers, TeamMembers } from '../../lib/pairity'
import { Toast } from '../common/toast'

class TeamItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: Object.assign({}, this.props.team),
            teamAdmin: '',
            errorMessage: ''
        };
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleMemberSelectorChange = this.handleMemberSelectorChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
    }

    handleMemberSelectorChange(event) {
        let { teamAdmin } = this.state
        teamAdmin = event.target.value
        this.setState({ teamAdmin })
    }

    handleNameChange(event) {
        const { team } = this.state
        team.name = event.target.value.toProperCase()
        this.setState({ team })
    }

    handleDescChange(event) {
        const { team } = this.state
        team.description = event.target.value
        this.setState({ team })
    }

    saveClick(event) {
        event.preventDefault()
        if (this.state.team.name === '' || this.state.team.description === '') {
            let { errorMessage } = this.state
            errorMessage = 'Team name and description required!'
            this.setState({ errorMessage })
        } else {
            const teamAdmin = this.state.teamAdmin || ''
            this.props.handleSave(this.state.team, teamAdmin)
        }
    }

    cancelClick(event) {
        event.preventDefault()
        this.props.handleCancel()
    }

    cancelButton() {
        if (this.props.showCancel) {
            return (
                <button id="btnCancel" type="button" onClick={this.cancelClick} className="button-default pure-button">
Cancel
                </button>
            )
        }
    }

    render() {
        return (
            <div className="pure-u-xs-1">
                <form className="pure-form pure-form-stacked">
                    <label>
Team Name
                    </label>
                    <input
                        id="teamName"
                        type="text"
                        placeholder="A unique name"
                        value={this.state.team.name}
                        onChange={this.handleNameChange}
                    />
                    <label>Team Administrator</label>
                    <select
                        id="memberSelector"
                        onChange={this.handleMemberSelectorChange}>
                        <option value="">Select</option>
                        {this.props.orgMembers.map(m => <option value={m.userId} key={m._id}>{m.username}</option> )}
                    </select>
                    <label>Description</label>
                    <textarea
                        id="teamDesc"
                        placeholder="Share what your team is all about?"
                        rows={this.props.rows}
                        onChange={this.handleDescChange}
                        value={this.state.team.description}
                    />
                    <p className="errorMessage">
                        {this.state.errorMessage}
                    </p>
                    <div className="form-buttons">
                        <button id="btnSave" type="submit" onClick={this.saveClick} className="button-primary pure-button">Save</button>
                        {this.cancelButton()}
                    </div>
                </form>
            </div>
        )
    }
}

TeamItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    team: PropTypes.object,
    orgMembers: PropTypes.array.isRequired,
    rows: PropTypes.number,
    showCancel: PropTypes.bool
}

TeamItem.defaultProps = {
    team: {
        name: '',
        description: ''
    },
    rows: 7,
    showCancel: true
}

export default TeamItem
