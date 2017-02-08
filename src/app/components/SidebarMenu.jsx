import React, {Component, PropTypes} from 'react';
import {Menu, MenuItem} from '@blueprintjs/core';

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: ''
    };
  }

  handleSearchChange = event => {
    const searchString = event.target.value.replace(/[\(\)\[\]]/g, '\\$&');

    this.setState({searchString});
  };

  buildMenuItems() {
    if (this.props.schemaReducer !== undefined) {
      const {data} = this.props.schemaReducer;
      const {searchString} = this.state;
      const searchStringRE = new RegExp(searchString, 'i');
      const menuItems = [];

      data.forEach((item, index) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          if (searchString === '' || searchString.length === 0 || searchStringRE.test(item.title)) {
            menuItems.push(
              <MenuItem item={item}
                key={index}
                text={item.title}
                href={'#/' + item.plural}
                className="item"
              />
            );
          }
        }
      });

      return menuItems;
    }
  }

  render() {
    return (
      <div className="pt-elevation-2 pt-fixed-top sidebar">
        <div className="sidebar-search">
          <label className="pt-label">
            <input type="text" className="pt-input"
              placeholder="search in sidebar" onChange={this.handleSearchChange}
            />
          </label>
        </div>
        <Menu className="pt-menu pt-large">
          {this.buildMenuItems()}
        </Menu>
      </div>
    );
  }
}

SidebarMenu.propTypes = {
  schemaReducer: PropTypes.object
};
