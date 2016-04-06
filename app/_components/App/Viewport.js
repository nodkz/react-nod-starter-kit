import React from 'react'; // eslint-disable-line no-unused-vars
import EventEmitter from 'eventemitter3';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';


if (typeof window === 'undefined') {
  const window = {};
}

let EE;
let viewport = { // Default size for server-side rendering
  width: 1366,
  height: 768,
  type: 'desktop',
};
const RESIZE_EVENT = 'resize';

function handleWindowResize() {
  if (viewport.width !== window.innerWidth || viewport.height !== window.innerHeight) {
    viewport = { width: window.innerWidth, height: window.innerHeight };
    EE.emit(RESIZE_EVENT, viewport);
  }
}


export const ViewportPropType = React.PropTypes.shape({
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  type: React.PropTypes.string,
});


export default class Viewport extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  static childContextTypes = {
    viewport: ViewportPropType,
    // subscribe function on viewport changes
    // need pass callback with params (currentViewport, previousViewport)
    // returns unsubscribe function
    viewportSubscribe: React.PropTypes.func,
  };

  constructor() {
    super();

    if (canUseDOM) {
      this.pseudoState = {
        width: window.innerWidth,
        height: window.innerHeight,
        type: this.constructor.getScreenType({ width: window.innerWidth }),
      };
    } else {
      this.pseudoState = viewport;
    }

    this.handlers = [];
    this.onSubscribe = this._onSubscribe.bind(this);
  }

  getChildContext() {
    return {
      viewport: this.pseudoState,
      viewportSubscribe: this.onSubscribe,
    };
  }

  componentDidMount() {
    if (!EE) {
      EE = new EventEmitter();
      window.addEventListener('resize', handleWindowResize);
      window.addEventListener('orientationchange', handleWindowResize);
    }

    EE.on(RESIZE_EVENT, this.handleResize, this);
  }

  componentWillUnmount() {
    EE.removeListener(RESIZE_EVENT, this.handleResize, this);
    if (!EE.listeners(RESIZE_EVENT, true)) {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
      EE = null;
    }
  }

  _onSubscribe(cb) {
    this.handlers.push(cb);

    return () => this._onUnsubscribe(cb);
  }

  _onUnsubscribe(cb) {
    this.handlers = this.handlers.filter(item => item !== cb);
  }

  static getScreenType({ width }) {
    if (width < 450) {
      return 'small';
    }
    if (width < 899) {
      return 'tablet';
    }
    return 'desktop';
  }

  handleResize(value) {
    const prevState = this.pseudoState;
    const newState = Object.assign({}, value);
    newState.type = this.constructor.getScreenType(value);
    this.pseudoState = Object.assign({}, prevState, newState);

    // rerender all app, if changes viewport type
    if (newState.type !== prevState.type) {
      this.setState({ type: newState.type });
    }

    this.handlers.forEach(item => item(newState, prevState));
  }

  render() {
    return this.props.children;
  }
}
