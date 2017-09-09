import React from 'react';
import PropTypes from 'prop-types';

const Message = ({
  username,
  content
}) => (
  <li>
    <strong>{username}</strong> : {content}
  </li>
);

Message.propTypes = {
  username: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Message;