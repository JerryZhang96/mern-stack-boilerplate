import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';
// pages for this product
import LandingPage from './views/LandingPage/LandingPage.js';
import LoginPage from './views/LoginPage/LoginPage.js';
import RegisterPage from './views/RegisterPage/RegisterPage.js';
import ForgetPage from './views/ForgetPage/ForgetPage.js';
import ResetPage from './views/ResetPage/ResetPage.js';
import NavBar from './views/NavBar/NavBar';
import Footer from './views/Footer/Footer';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path='/' component={Auth(LandingPage, null)} />
          <Route exact path='/login' component={Auth(LoginPage, false)} />
          <Route exact path='/register' component={Auth(RegisterPage, false)} />
          <Route
            exact
            path='/users/password/forget'
            component={Auth(ForgetPage, false)}
          />
          <Route
            exact
            path='/users/password/reset/:token'
            component={Auth(ResetPage, false)}
          />
          <Route component={Auth(NotFoundPage, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
