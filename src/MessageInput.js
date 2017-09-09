import React from 'react';
import PropTypes from 'prop-types';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import compose from 'recompose/compose';
import { graphql } from 'react-apollo';
import SUBMIT_MESSAGE_MUTATION from './SubmitMessage.graphql';
import GET_MESSAGES_QUERY from './GetMessages.graphql';

const enhance = compose(
  graphql(SUBMIT_MESSAGE_MUTATION, {
    props: ({ ownProps, mutate }) => ({
      sendMessage: content => mutate({
        variables: { content },
        update: (store, { data: { submitMessage } }) => {
          const data = store.readQuery({ query: GET_MESSAGES_QUERY });
          data.getMessages.push(submitMessage);
          store.writeQuery({ query: GET_MESSAGES_QUERY, data });
        },
      }),
    }),
  }),
  withState('value', 'updateValue', ''),
  withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value);
    },
    onSubmit: props => event => {
      event.preventDefault();
      props.updateValue('');
      props.sendMessage(props.value);
    },
  })
);

const MessageInput = enhance(({ value, onChange, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <label>Value
      <input type="text" value={value} onChange={onChange} />
      <input type="submit"/>
    </label>
  </form>
)

MessageInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
};

export default MessageInput;