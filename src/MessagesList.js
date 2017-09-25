import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import lifecycle from 'recompose/lifecycle';
import renderComponent from 'recompose/renderComponent';
import mapProps from 'recompose/mapProps';
import Message from './Message';
import GET_MESSAGES_QUERY from './GetMessages.graphql';
import ON_MESSAGE_ADDED_SUBSCRIPTION from './OnMessageAdded.graphql';

const MessagesList = ({
  messages
}) => (
  <ul>
    {messages.map(({ id, ...message }) => <Message key={id} {...message} />)}
  </ul>
);

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    ...Message.propTypes,
  })),
};



export default compose(
  graphql(GET_MESSAGES_QUERY, {
    props: ({ ownProps, data }) => ({
      data,
      subscribeToNewMessage: () => data.subscribeToMore({
        document: ON_MESSAGE_ADDED_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          console.log('UPDATE QUERY');
          if (!subscriptionData.data) {
            return prev;
          }
          const messageAdded = subscriptionData.data.messageAdded;
          return {
            getMessages: [
              ...prev.getMessages.filter(msg => msg.id !== messageAdded.id),
              messageAdded,
            ]
          };
        }
      })
    })
  }),
  branch(
    props => props.data.loading,
    renderComponent(() => <p>Loading</p>)
  ),
  branch(
    props => props.data.error,
    renderComponent(props => {
      //console.error(props.data.error); //impurity powaa
      return <p style={{color: 'red'}}>{props.data.error.toString()}</p>
    })
  ),
  mapProps(({ data, ...otherProps }) => ({
    ...otherProps,
    messages: data.getMessages.map(m => ({
      id: m.id,
      username: m.user.username,
      content: m.content
    }))
  })),
  lifecycle({
    componentDidMount() {
      this.props.subscribeToNewMessage();
    }
  })
)(MessagesList);