/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';

function withStyles(...styles) {
  return (BaseComponent) => class StyledComponent extends Component {
    static contextTypes = {
      insertCss: PropTypes.func.isRequired,
    };

    static displayName = BaseComponent.displayName || BaseComponent.name;

    constructor(props) {
      super(props);

      this.setState = (state) => this.refs.component.setState(state);
    }

    componentWillMount() {
      this.removeCss = this.context.insertCss.apply(undefined, styles);
    }

    componentWillUnmount() {
      this.removeCss();
    }

    render() {
      return <BaseComponent {...this.props} ref="component" />;
    }
  };
}

export default withStyles;
