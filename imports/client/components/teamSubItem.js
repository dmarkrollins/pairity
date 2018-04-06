import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Pairity, Teams } from '../../../imports/lib/pairity'

class TeamSubItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: Object.assign({}, this.props.list) // eslint-disable-line
        };
        this.handleItemSave = this.handleItemSave.bind(this)
        this.handleItemRemove = this.handleItemRemove.bind(this)
    }

    handleItemSave(event) {
        this.props.handleSave()
    }

    handleItemRemove(event) {
        this.props.handleRemove()
    }

    subItems() {
        const items = []
        this.props.list.forEach((item) => {
            const newItem = (<Pairity.Components.TeamSubListItem
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
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <label>{this.props.label}</label>
                        <div style={{
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '7px',
                            height: '32px'
                        }}>
                            <a href="#" onClick={this.handleItemSave}>
                                <i id="btnAdd" className="fa fa-plus-circle" style={{ fontSize: '1.5em', color: '#659BB9', marginRight: '21px' }} />
                            </a>
                            <a href="#" onClick={this.handleItemRemove}>
                                <i id="btnRemove" className="fa fa-minus-circle" style={{ fontSize: '1.5em', color: '#ccc' }} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <select id="itemList" size="7" className="item-box">
                            {this.subItems}
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

TeamSubItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired
}

module.exports = TeamSubItem
