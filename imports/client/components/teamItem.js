import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class TeamItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: Object.assign({}, this.props.team),
            errorMessage: ''
        };
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
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
            this.props.handleSave(this.state.team)
        }
    }

    cancelClick(event) {
        event.preventDefault()
        this.props.handleCancel()
    }

    cancelButton() {
        if (this.props.showCancel) {
            return <button id="btnCancel" type="button" onClick={this.cancelClick} className="button-default pure-button">Cancel</button>
        }
    }

    render() {
        return (
            <div className="pure-u-xs-1">
                <form className="pure-form pure-form-stacked">
                    <label>Team Name</label>
                    <input
                        id="teamName"
                        type="text"
                        placeholder="A unique name"
                        value={this.state.team.name}
                        onChange={this.handleNameChange}
                    />
                    <label>Description</label>
                    <textarea
                        id="teamDesc"
                        placeholder="Share what your team is all about?"
                        rows={this.props.rows}
                        onChange={this.handleDescChange}
                        value={this.state.team.description}
                    />
                    <p className="errorMessage">{this.state.errorMessage}</p>
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

module.exports = TeamItem
