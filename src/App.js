import React from 'react';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import Header from 'components/common/Header';
import EmployeePage from 'components/pages/employees/EmployeePage';

const customHistory = createBrowserHistory();

const App = ({ location }) => (
  <div>
    <Router history={customHistory}>
      <Header/><br/>
      <Route location={location} exact path="/" component={EmployeePage} />
    </Router>
  </div>
)

export default App;
