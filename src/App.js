import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as Icon from 'react-feather';

import './App.scss';

import Home from './components/home';
import Indonesia from './components/indonesia';
import Bangladesh from './components/bangladesh';
import Navbar from './components/navbar';

const history = require('history').createBrowserHistory;

function App() {
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'India',
      animationDelayForNavbar: 0.2,
    },
	{
      pageLink: '/indonesia',
      view: Indonesia,
      displayName: 'Indonesia',
      animationDelayForNavbar: 0.3,
    },
	// {
  //     pageLink: '/bangladesh',
  //     view: Bangladesh,
  //     displayName: 'Bangladesh',
  //     animationDelayForNavbar: 0.4,
  //   },
  ];

  return (
    <div className="App">
      <Router history={history}>
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              <Navbar pages={pages} />
				  {/*<Banner />*/}
              <Route exact path="/" render={() => <Redirect to="/" />} />
              <Switch location={location}>
                {pages.map((page, i) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      component={page.view}
                      key={i}
                    />
                  );
                })}
                <Redirect to="/" />
              </Switch>
            </div>
          )}
        />
      </Router>

      <footer className="fadeInUp" style={{animationDelay: '2s'}}>
        <h5>We stand with everyone fighting on the frontlines</h5>
        <div className="link">
          <a
            href="http://www.iitkconsult.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            IIT Kanpur Consulting Group
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;