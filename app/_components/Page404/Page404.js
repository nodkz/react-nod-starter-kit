import React from 'react';
import withStyles from 'app/_components/withStyles';
import Helmet from 'react-helmet';
import s from './Page404.scss';

@withStyles(s)
class Page404 extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <Helmet title="404 Page not found" />
        <div className={s.huge}>
          404
        </div>
        <div>
          Страница не найдена
        </div>
      </div>
    );
  }
}

Page404.isNotFound = true; // due to withStyle decorator, we set up it outside, right before export
export default Page404;
