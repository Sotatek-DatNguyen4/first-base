import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { clearAlert } from './store/actions/alert'
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/Base/ErrorBoundary';
import HomePage from './pages/HomePage/Index';
import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import Login from './pages/Login';
import CampaignDetailPage from './pages/CampaignDetailPage';
import BuyToken from './pages/BuyToken';
import Setting from './pages/Setting';
import NetworkChange from './pages/NetworkChange';
//@ts-ignore
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import AppContainer from "./AppContainer";

/**
 * Main App routes.
 */
const Routes: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const dispatch = useDispatch();

  const alert = useSelector((state: any) => state.alert);
  const { history } = props;

  useEffect(() => {
    const { type, message } = alert;
    if (type && message) {
      NotificationManager[type](message);
    }
  }, [alert]);

  useEffect(() => {
    history.listen((location, action) => {
      dispatch(clearAlert());
    });
  }, []);


  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/campaign-detail/:id" component={CampaignDetailPage} />
        <Route path="/error" component={ErrorPage} />
        <Route path="/campaigns" exact component={Campaigns} />
        <Route path="/campaigns/add" exact component={CreateCampaign} />
        <Route path="/login" component={Login} />
        <Route path="/buy-token" component={BuyToken} />
        <Route path="/setting" component={Setting} />
        <Route path="/network-change" component={NetworkChange} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
};

const RoutesHistory = withRouter(Routes);

const routing = function createRouting() {
  return (
    <>
      <NotificationContainer />
      <Router>
        <AppContainer>
          <ErrorBoundary>
            <RoutesHistory />
          </ErrorBoundary>
        </AppContainer>
      </Router>
    </>
  );
};
/**
 * Wrap the app routes into router
 *
 * PROPS
 * =============================================================================
 * @returns {React.Node}
 */
export default routing;
