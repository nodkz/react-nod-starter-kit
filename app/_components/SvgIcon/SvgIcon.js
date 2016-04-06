import React from 'react';
import InlineSVG from 'svg-inline-react';

class SvgIcon extends React.Component {
  static propTypes = {
    style: React.PropTypes.object,
    width: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    height: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    color: React.PropTypes.string,
    filename: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
  };

  static defaultProps = {
    color: '#ffffff',
    width: 24,
    height: 24,
    rootPath: '',
    style: {
      display: 'inline-block',
    },
  };

  constructor(props) {
    super(props);
  }

  render() {
    // this.props.style.border = '1px solid red';
    return (
      <div
        className={this.props.className}
        style={this.props.style}
      >
        <InlineSVG
          style={{
            width: this.props.width,
            height: this.props.height,
            fill: this.props.color,
            display: 'inline-block',
          }}
          src={require(`!svg-inline!./svg-icons/${this.props.filename}`)}
        />
      </div>
    );
  }
}

export default SvgIcon;
