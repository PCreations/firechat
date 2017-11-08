import React, { Component } from 'react';
import * as firebase from 'firebase';
import { withApollo } from 'react-apollo';
import CREATE_USER_MUTATION from './CreateUser.graphql';
import { auth } from './firebase';
import logo from './logo.svg';
import './App.css';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';


class App extends Component {
  state = {
    authenticated: auth.currentUser !== null,
  };
  githubAuth = () => {
    const { client } = this.props;
    const self = this;
    const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth()
        .signInWithPopup(provider)
        .then(result => {
          const user = result.user;
          window.localStorage.setItem('firechatCredential', result.credential.accessToken);
          client.mutate({
            mutation: CREATE_USER_MUTATION,
            variables: {
              user: {
                id: user.uid,
                username: user.displayName || user.email,
              },
            },
          }).then(() => self.setState({ authenticated: true }));
        });
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
          <button onClick={this.githubAuth}>LOGIN WITH GITHUB</button>
        )}
      </div>
    )
  }
}

export default withApollo(App);
