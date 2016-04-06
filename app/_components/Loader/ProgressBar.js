// https://github.com/react-toolbox/react-toolbox/blob/dev/components/progress_bar/ProgressBar.jsx

import React from 'react';
import cx from 'classnames';

import withStyles from 'app/_components/withStyles';
import s from './ProgressBar.scss';

@withStyles(s)
class ProgressBar extends React.Component {
  static propTypes = {
    buffer: React.PropTypes.number,
    className: React.PropTypes.string,
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    mode: React.PropTypes.string,
    multicolor: React.PropTypes.bool,
    type: React.PropTypes.oneOf(['linear', 'circular']),
    value: React.PropTypes.number,
    style: React.PropTypes.object,
  };

  static defaultProps = {
    buffer: 0,
    className: '',
    max: 100,
    min: 0,
    mode: 'indeterminate',
    multicolor: false,
    type: 'linear',
    value: 0,
  };

  calculateRatio(value) {
    if (value < this.props.min) return 0;
    if (value > this.props.max) return 1;
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  circularStyle() {
    if (this.props.mode !== 'indeterminate') {
      return {
        strokeDasharray: `${2 * Math.PI * 25 * this.calculateRatio(this.props.value)}, 400`
      };
    }
  }

  linearStyle() {
    if (this.props.mode !== 'indeterminate') {
      return {
        buffer: { transform: `scaleX(${this.calculateRatio(this.props.buffer)})` },
        value: { transform: `scaleX(${this.calculateRatio(this.props.value)})` },
      };
    }

    return {};
  }

  renderCircular() {
    return (
      <svg className={s.circle}>
        <circle className={s.path} style={this.circularStyle()} cx="30" cy="30" r="25" />
      </svg>
    );
  }

  renderLinear() {
    const { buffer, value } = this.linearStyle();
    return (
      <div>
        <span ref="buffer" data-ref="buffer" className={s.buffer} style={buffer}></span>
        <span ref="value" data-ref="value" className={s.value} style={value}></span>
      </div>
    );
  }

  render() {
    const className = cx(s[this.props.type], {
      [s[this.props.mode]]: this.props.mode,
      [s.multicolor]: this.props.multicolor,
    }, this.props.className);

    return (
      <div
        data-react-toolbox="progress-bar"
        aria-valuenow={this.props.value}
        aria-valuemin={this.props.min}
        aria-valuemax={this.props.max}
        className={className}
        style={this.props.style}
      >
        {this.props.type === 'circular' ? this.renderCircular() : this.renderLinear()}
      </div>
    );
  }
}

export default ProgressBar;
