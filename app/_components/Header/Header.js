import React from 'react';
import SvgIcon from 'app/_components/SvgIcon';
import withStyles from 'app/_components/withStyles';
import s from './Header.scss';
import { ViewportPropType } from '../App/Viewport';

@withStyles(s)
class Header extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    tabActiveIdx: React.PropTypes.number,
    children: React.PropTypes.node,
    doChangeTabIndex: React.PropTypes.func,
  };

  static contextTypes = {
    viewport: ViewportPropType,
    viewportSubscribe: React.PropTypes.func,
    getSwipeMagicIdx: React.PropTypes.func,
    setSwipeMagicIdx: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      SwipeMagicIndex: 1,
      viewport: null,
      prevSwipeMagicIndex: 1,
    };

    this.toggleMenu = this._toggleMenu.bind(this);
    this.doSwipeMagicBack = this._doSwipeMagicBack.bind(this);
  }

  componentWillMount() {
    this.unsubscribeViewport = this.context.viewportSubscribe(this._handleResize.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeViewport();
  }

  _handleResize(viewport) {
    this.setState({ viewport });
  }

  _toggleMenu() {
    const SwipeMagicIdx = this.context.getSwipeMagicIdx();
    let newIndex = 0;

    if (SwipeMagicIdx !== 0) {
      this.setState({ prevSwipeMagicIndex: SwipeMagicIdx });
    } else {
      newIndex = this.state.prevSwipeMagicIndex;
    }

    this.context.setSwipeMagicIdx(newIndex);
    this.setState({ SwipeMagicIndex: newIndex });
  }

  _doSwipeMagicBack() {
    const SwipeMagicIdx = this.context.getSwipeMagicIdx();
    if (SwipeMagicIdx > 0) {
      const newIndex = SwipeMagicIdx - 1;
      this.context.setSwipeMagicIdx(SwipeMagicIdx - 1);
      this.setState({ SwipeMagicIndex: newIndex });
    }
  }

  render() {
    const viewport = this.state.viewport || this.context.viewport;
    const { SwipeMagicIndex } = this.state;

    return (
      <header className={this.props.className}>
        <div className={s.root}>
          <div className={s.left}>
            { SwipeMagicIndex < 1
              ? <div className={s.logo}>
                  rabota.kz
                </div>
              : <div className={s.icon} onClick={this.doSwipeMagicBack}>
                  <SvgIcon color="#333333" width="24" height="24"
                    filename="ic_arrow_back_24px.svg"
                  />
                </div>
            }
          </div>
          <div className={s.center}>
            {viewport.type} [{viewport.width}x{viewport.height}]
            &nbsp;&nbsp;
            {this.props.children}
          </div>
          <div className={s.right}>
            <div className={s.icon} onClick={this.toggleMenu}>
              <SvgIcon color="#333333" width="24" height="24"
                filename="ic_menu_24px.svg"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
