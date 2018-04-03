import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Pairity, Teams } from '../../../imports/lib/pairity'

class TeamSubItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: Object.assign({}, this.props.list)
        };
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.handleItemSave = this.handleItemAdd.bind(this)
        this.handleItemCancel = this.handleItemCancel.bind(this)
        this.handleItemRemove = this.handleItemRemove.bind(this)
    }

    handleItemSave(event) {
        this.props.handleSave()
    }

    handleItemCancel(event) {
        this.props.handleCancel()
    }

    handleItemRemove(event) {
        this.props.handleRemove()
    }

    subItems() {
        const items = []
        this.props.list.forEach((item) => {
            const newItem = (<Pairity.Components.TeamSubItemListItem
                label={item.label}
                value={item.value}
            />)
            items.push(newItem)
        })
        return items
    }

    render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <div className="pure-g">
                        <div className="pure-u-3-4">
                            <label>{this.props.label}</label>
                        </div>
                        <div className="pure-u-1-4">
                            <a href="#" onClick={this.handleItemSave}>
                                <i id="btnAdd" className="fa fa-plus-circle" style={{ color: '#659BB9', marginRight: '7px' }} />
                            </a>
                            <a href="#" onClick={this.handleItemRemove}>
                                <i id="btnRemove" className="fa fa-minus-circle" style={{ color: '#ccc' }} />
                            </a>
                        </div>
                    </div>
                    <div className="pure-g">
                        <div className="pure-u-1">
                            <select id="itemList" size="5">
                                {this.subItems}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

TeamSubItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired
}

module.exports = TeamSubItem
