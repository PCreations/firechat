import React, { Component } from 'react';
import * as firebase from 'firebase';
import withState from 'recompose/withState';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import createEagerElement from 'recompose/createEagerElement';
import compose from 'recompose/compose';
import { withApollo } from 'react-apollo';
import CREATE_USER_MUTATION from './CreateUser.graphql';
import { firebaseApp } from './firebase';
import logo from './logo.svg';
import './App.css';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';


/*const GithubAuthenticator = BaseComponent => withApollo(({
  setAuthenticated,
  client,
  ...props
}) => {
  const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        window.localStorage.setItem('firechatAuth', user);
        client.mutate({
          mutation: CREATE_USER_MUTATION,
          variables: {
            user: { username: user.displayName, id: user.uuid },
          }
        }).then(() => setAuthenticated(true));
      });
  return createEagerElement(BaseComponent, props);
});

const withGithubAuth = compose(
  withState('authenticated', 'setAuthenticated', _ => window.localStorage.getItem('firechatAuth') !== null),
  branch(
    props => props.authenticated === false,
    renderComponent(() => <div>Authenticating...</div>)
  ),
  GithubAuthenticator
);*/

class App extends Component {
  state = {
    authenticated: window.localStorage.getItem('firechatAuth') !== null,
  };
  componentDidMount() {
    const self = this;
    const { client } = this.props;
    if (!self.state.authenticated) {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth()
        .signInWithPopup(provider)
        .then(result => {
          const user = result.user;
          window.localStorage.setItem('firechatAuth', user.uid);
          client.mutate({
            mutation: CREATE_USER_MUTATION,
            variables: {
              user: {
                id: user.uid,
                username: user.displayName,
              },
            },
          }).then(() => self.setState({ authenticated: true }));
        });
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Firechat</h2>
        </div>
        {this.state.authenticated ? (
          <div>
            <MessagesList />
            <MessageInput sendMessage={console.log.bind(console)} />
          </div>
        ) : (
          <p>Authenticating...</p>
        )}
      </div>
    )
  }
}

export default withApollo(App);
