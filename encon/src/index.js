import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, withRouter} from 'react-router-dom';
import { Security } from '@okta/okta-react';
import config from './App.Config.js';
import  App  from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppWithRouter = withRouter(App);

function onAuthRequired({ history }) {
	history.push('/login');
  }

ReactDOM.render(
	<Router>
		<Security issuer={config.issuer}
		client_id={config.client_id}
		redirect_uri={config.redirect_uri}
		onAuthRequired={onAuthRequired}>
			<AppWithRouter />
		</Security>
	</Router>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
