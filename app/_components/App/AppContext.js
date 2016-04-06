import React, { Component, PropTypes, Children } from 'react';

export default class AppContext extends Component {
  static propTypes = {
    insertCss: PropTypes.func,
    onPageNotFound: PropTypes.func,
    children: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  _emptyFunction = () => {};
  _emptyInsertCssFn = () => { return this._emptyFunction; };

  getChildContext() {
    return {
      insertCss: this.props.insertCss || this._emptyInsertCssFn,
      onPageNotFound: this.props.onPageNotFound || this._emptyFunction,
    };
  }

  render() {
    return this.props.children;
  }
}
