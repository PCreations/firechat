import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import mapProps from 'recompose/mapProps';
import Message from './Message';
import GET_MESSAGES_QUERY from './GetMessages.graphql';

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
  graphql(GET_MESSAGES_QUERY),
  branch(
    props => props.data.loading,
    renderComponent(() => <p>Loading</p>)
  ),
  branch(
    props => props.data.error,
    renderComponent(props => <p style={{color: 'red'}}>{props.data.error.toString()}</p>)
  ),
  mapProps(props => {
    console.log(props);
    return {
      messages: props.data.getMessages.map(m => ({
        id: m.id,
        username: m.user.username,
        content: m.content
      }))
    };
  })
)(MessagesList);