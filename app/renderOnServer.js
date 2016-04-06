import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Html from 'app/_components/Html';
import { match, RouterContext } from 'react-router';
import routes from 'app/routes';
import assets from './assets';
import seqqueue from 'seq-queue';
import isomorphicVars from 'app/_shared/isomorphicVars';
import App from 'app/_components/App/App';
import AppContext from 'app/_components/App/AppContext';

export default (req, res, next) => {
  try {
    const headers = {};
    if (req.cookies && req.cookies.auth_token) {
      headers.Cookie = 'auth_token=' + req.cookies.auth_token;
    }

    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
      function render() {
        const data = {
          css: '',
          body: '',
          entry: assets.main.js,
          isomorphicVars: JSON.stringify(isomorphicVars()),
        };
        const css = [];
        const context = {
          insertCss: styles => css.push(styles._getCss()),
        };

        // handle 404 component with correct status code
        const notFound = renderProps.components
            .filter(component => component.isNotFound)
            .length > 0;
        if (notFound) {
          res.status(404);
        }

        /*
        INTL module problem
        data.body += ReactDOMServer.renderToString(
          <AppContext {...context}>
            <RouterContext {...renderProps} />
          </AppContext>
        );
        */
        data.css = css.join('');

        const html = ReactDOMServer.renderToStaticMarkup(<Html {...data} />);
        res.send(`<!doctype html>\n${html}`);
      }

      if (error) {
        next(error);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        render();
      } else {
        res.status(404).send('Not Found');
      }
    });
  } catch (error) {
    next(error);
  }
};
