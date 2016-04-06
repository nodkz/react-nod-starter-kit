import React from 'react';
import withStyles from 'app/_components/withStyles';
import s from './PageIndex.scss';

@withStyles(s)
class PageIndex extends React.Component {
  static propTypes = {
  };


  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className={s.root}>
        <div>
          Это заглушка главной страницы
        </div>
      </div>
    );
  }
}

export default PageIndex;
