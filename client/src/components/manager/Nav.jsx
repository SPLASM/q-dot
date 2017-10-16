import React from 'react';
import StatusSwitch from './StatusSwitch.jsx';

const Nav = (props) => {
  return (
    <nav className="col-xs-12">
        <div className="col-sm-1 col-xs-2">
          <a className="navbar-brand col-xs-12" href="#">q.</a>
        </div>
        <ul className="col-sm-3 col-xs-10 link" style={{padding: '16px'}}>
          <li className="active"><a href="#" className="col-xs-12">Manager Home Page</a></li>
        </ul>
        <ul className="col-sm-8 col-xs-12">
          <StatusSwitch status={props.status} switchStatus={props.switchStatus.bind(this)}/>
        </ul>
    </nav>
  );
};

export default Nav;
