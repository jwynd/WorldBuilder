import React from 'react';
import './App.scss';
import menu from './icons/menu.svg';

class SideMenu extends React.Component {
  state = { expanded: false };

  toggleMenu = () => this.setState(prevState => ({ expanded: !prevState.expanded }));

  render() {
    const { expanded } = this.state;

    let menuIcon = <img src={menu} className="App-menu" alt="menu" height="50" span style={{cursor:"pointer"}} onClick={ this.toggleMenu }/>;

    let sidebar = this.state.expanded ? ( <div className='sidebar'>
                    <ul className='menuItemList'>
                      <li className='menuItem'>New Map</li>
                      <li className='menuItem'>Load</li>
                      <li className='menuItem'>Save</li>
                      <li className='menuItem'>Edit</li>
                      <li className='menuItem'>Regenerate</li>
                    </ul>
                  </div> ) : null;

    return (
      <>
        {menuIcon}
        {sidebar}
      </>
    )
  }
}

export default SideMenu;