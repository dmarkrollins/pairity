import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TeamSubListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isSelected: false }
        this.itemSelect = this.itemSelect.bind(this)
    }

    itemSelect(event) {
        let { isSelected } = this.state
        isSelected = !isSelected
        this.setState({ isSelected })
        this.props.handleSelected(this.props.value, isSelected)
    }

    itemClass() {
        return this.props.className
    }

    render() {
        return (
            <div
                onClick={this.itemSelect}
                className={this.itemClass()}
                value={this.props.value}
                selected={this.props.selected}
            >
                {this.props.label}
            </div>
        )
    }
}

TeamSubListItem.propTypes = {
    handleSelected: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    selected: PropTypes.bool
}

TeamSubListItem.defaultProps = {
    className: 'unselected-item',
    selected: false
}

module.exports = TeamSubListItem
