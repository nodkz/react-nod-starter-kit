import App from 'app/_components/App/App';
import PageIndex from 'app/_components/PageIndex/PageIndex';
import Page404 from 'app/_components/Page404/Page404';

const route404 = {
  path: '*',
  component: Page404,
};

export default [
  {
    path: '/',
    component: App,
    indexRoute: { components: PageIndex },
    //childRoutes: [
    //  route404,
    //],
  },
];
