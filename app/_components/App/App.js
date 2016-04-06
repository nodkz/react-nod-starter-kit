import React, { Component, PropTypes } from 'react';
import s from './App.scss';
import Helmet from 'react-helmet';

import { IntlProvider, addLocaleData } from 'react-intl';
import ruMessages from '../../../i18n/ru/ru.js';
import ruLocale from 'react-intl/lib/locale-data/ru';
addLocaleData(ruLocale);

import Viewport from './Viewport';
import Header from '../Header/Header';
import isomorphicVars from 'app/_shared/isomorphicVars';


const window = window || {};

class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static contextTypes = {
    insertCss: React.PropTypes.func,
  };

  componentWillMount() {
    this.removeCss = this.context.insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    const isoVars = isomorphicVars();
    const headerText = `${isoVars.version}`;

    console.log('render App');
    return (
      <IntlProvider defaultLocale="ru" locale="ru" messages={ruMessages}>
        <Viewport>
          <div className={s.root}>
            <Helmet title="Главная" />
            <Header className={s.header} ref="Header">
              {headerText} {Date.now()}
            </Header>
            <section className={s.body}>
              {this.props.children}
            </section>
          </div>
        </Viewport>
      </IntlProvider>
    );
  }
}

export default App;
