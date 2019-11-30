import React from 'react';
import './App.scss';
import menu from './icons/menu.svg';
import './scss/_modal.scss';
import './scss/_buttons.scss';
import { Modal, ListGroup } from 'react-bootstrap';
import { mWidth, mHeight, mapName } from './js/main.js';

class setupMenu extends React.Component {
  constructor () {
    super();
    this.state = { showModalMenu: true };
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default setupMenu;
