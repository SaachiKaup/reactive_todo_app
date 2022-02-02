import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const dom_container = document.querySelector('#like_button_container')
ReactDOM.render(e(LikeButton), domContainer);