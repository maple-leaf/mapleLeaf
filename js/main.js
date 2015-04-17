var _ = require('lodash');
var React = require('react');
var components = require('./components');
var CommentBox = components.commentBox();

React.render(
  <CommentBox />,
  document.getElementById('main')
);
