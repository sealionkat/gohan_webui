import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

const Tab = props => {
  const {
    onClick = () => {},
    isActive = false,
    title,
  } = props;

  return (
    <a className={isActive ? styles.tabHeaderActive : styles.tabHeader}
      onClick={onClick}>
      {title}
    </a>
  );
};

export default Tab;

if (process.env.NODE_ENV !== 'production') {
  Tab.propTypes = {
    panel: PropTypes.node.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
  };
}
