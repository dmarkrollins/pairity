import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class TeamSubItemListItem extends React.Component {
    constructor(props) {
        super(props);
        this.itemSelect = this.itemSelect.bind(this)
    }

    itemSelect(event) {
        this.props.handleSelected()
    }

    itemStyle() {

    }

    render() {
        return (
            <li
                style={this.itemStyle}
                onClick={this.itemSelect}
                option={this.props.label}
                value={this.props.value}
            />
        )
    }
}

TeamSubItemListItem.propTypes = {
    handleSelected: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
}

module.exports = TeamSubItemListItem
