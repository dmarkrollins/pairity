import React, { Component } from 'react'

import PropTypes from 'prop-types'

class OrganizationItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            org: Object.assign({}, this.props.org),
            errorMessage: ''
        };
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
    }

    handleNameChange(event) {
        const { org } = this.state
        org.name = event.target.value.toProperCase()
        this.setState({ org })
    }

    handleDescChange(event) {
        const { org } = this.state
        org.description = event.target.value
        this.setState({ org })
    }

    saveClick(event) {
        event.preventDefault()
        if (this.state.org.name === '' || this.state.org.description === '') {
            let { errorMessage } = this.state
            errorMessage = 'Organization name and description required!'
            this.setState({ errorMessage })
        } else {
            this.props.handleSave(this.state.org)
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
                    <label>Organization Name</label>
                    <input
                        id="orgName"
                        type="text"
                        placeholder="A unique organization name"
                        value={this.state.org.name}
                        onChange={this.handleNameChange}
                    />
                    <label>Description</label>
                    <textarea
                        id="orgDesc"
                        placeholder="Share what this organization is all about?"
                        rows={this.props.rows}
                        onChange={this.handleDescChange}
                        value={this.state.org.description}
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

OrganizationItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    org: PropTypes.object,
    rows: PropTypes.number,
    showCancel: PropTypes.bool
}

OrganizationItem.defaultProps = {
    org: {
        name: '',
        description: ''
    },
    rows: 7,
    showCancel: true
}

module.exports = OrganizationItem
