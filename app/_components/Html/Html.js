import React, { Component, PropTypes } from 'react';
import { googleAnalyticsId } from '../../../config/config';
import Helmet from 'react-helmet';

class Html extends Component {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    css: PropTypes.string,
    body: PropTypes.string.isRequired,
    entry: PropTypes.string.isRequired,
    isomorphicVars: PropTypes.string, // initial variables for starting app
    preloadedData: PropTypes.string, // relay data fetched from database
  };

  static defaultProps = {
    title: '',
    description: '',
    preloadedData: '',
  };

  componentWillMount() {
    this.helmet = Helmet.rewind();
  }

  trackingCode() {
    return (
      `(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=` +
      `function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;` +
      `e=o.createElement(i);r=o.getElementsByTagName(i)[0];` +
      `e.src='https://www.google-analytics.com/analytics.js';` +
      `r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));` +
      `ga('create','${googleAnalyticsId}','auto');ga('send','pageview');`
    );
  }

  webFontCode() {
    return (`
      var WebFontConfig = {
        google: { families: [ 'Roboto:300,400,500:latin' ] }
      };
      (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();
    `);
  }

  render() {
    return (
      <html className="no-js" lang="">
      <head>
        {this.helmet.title.toComponent()}
        {this.helmet.meta.toComponent()}
        {this.helmet.link.toComponent()}

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        <title>{this.props.title}</title>
        <meta name="description" content={this.props.description} />

        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <style id="css" dangerouslySetInnerHTML={{ __html: this.props.css }} />
      </head>
      <body>
        <div>
          <script dangerouslySetInnerHTML={{ __html: this.webFontCode() }} />
          <script dangerouslySetInnerHTML={{ __html: `window.isomorphicVars = ${this.props.isomorphicVars}` }} />
          <div id="app" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <script id="preloadedData" type="application/json" dangerouslySetInnerHTML={{ __html: this.props.preloadedData }} />
          <script src={this.props.entry}></script>
          <script dangerouslySetInnerHTML={{ __html: this.trackingCode() }} />
        </div>
      </body>
      </html>
    );
  }

}

export default Html;
