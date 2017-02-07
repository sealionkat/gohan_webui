import React, {Component, PropTypes} from 'react';
import {Menu, MenuItem} from '@blueprintjs/core';
import _ from 'lodash';

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      menuItems: [],
      originalMenuItems: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.schemaReducer !== undefined && nextProps.schemaReducer.data !== undefined) {
      const menuItems = [];
      const {data} = nextProps.schemaReducer;

      data.forEach((item, index) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          menuItems.push(
            <MenuItem item={item}
              key={index}
              text={item.title}
              href={'#/' + item.plural}
              className="item"
            />
          );
        }
      });

      let originalMenuItems = _.cloneDeep(menuItems);

      this.setState({menuItems, originalMenuItems});
    }
  }

  handleSearchChange = event => {
    const searchString = event.target.value.replace(/[\(\)\[\]]/g, '\\$&');
    const searchStringRE = new RegExp(searchString, 'i');
    const originalMenuItems = _.cloneDeep(this.state.originalMenuItems);

    if (searchString === '' || searchString.length === 0) {
      this.setState({searchString, menuItems: originalMenuItems});

      return;
    }

    let menuItems = originalMenuItems.filter(item => {
      return searchStringRE.test(item.props.text);
    });

    this.setState({searchString, menuItems});
  };


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
          {this.state.menuItems}
        </Menu>
      </div>
    );
  }
}

SidebarMenu.propTypes = {
  schemaReducer: PropTypes.object
};
