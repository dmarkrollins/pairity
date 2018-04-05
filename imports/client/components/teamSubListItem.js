import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class TeamSubListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedItem: '' }
        this.itemSelect = this.itemSelect.bind(this)
    }

    itemSelect(event) {
        let { selectedItem } = this.state
        selectedItem = this.props.value
        this.setState(selectedItem)
        this.props.handleSelected()
    }

    itemStyle() {
        const style = { backgroundColor: '#fff' }
        if (this.state.selectedItem === this.props.value) {
            style.backgroundColor = '#3E94B4'
        }

        return style
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

TeamSubListItem.propTypes = {
    handleSelected: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
}

module.exports = TeamSubListItem
