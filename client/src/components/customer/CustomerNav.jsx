import React from 'react';
import Link from 'react-router-dom';
import $ from 'jquery';
import RewardModal from './Modals/RewardModal.jsx';

class CustomerNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservationRewards: 0,
      queueRewards: 0
    };
  }

  componentDidMount() {
    this.getUserRewards();
  }

  getUserRewards() {
    $.ajax({
      method: 'GET',
      url: '/rewards',
      success: (data) => {
        this.setState({
          reservationRewards: data.reservationCount,
          queueRewards: data.queueCount
        });
      },
      failure: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  handleClick(path) {
    $.ajax({
      method: 'GET',
      url: path,
      success: (data) => {
        window.location.href = '/customer';
      }
    });
  }

  render() {
    return (
      <div className="customer-nav-bar">
        <ul id="dropdown1" className="dropdown-content">
          <li><a href="/">home</a></li>
          <li className="divider"></li>
          <li><a href="../manager">manager</a></li>
        </ul>
        <nav>
          <div className="nav-wrapper">
            <ul className="nav-mobile hide-on-med-and-down inline">
              <li><a className="dropdown-button" href="#!" data-activates="dropdown1">q.<i className="material-icons right">arrow_drop_down</i></a></li>
            </ul>
            { !this.props.user
              ? <ul className="nav-mobile hide-on-med-and-down inline right customer-nav-login">
                <li onClick={e => location.href = '/customersignup'}>
                  <span className="glyphicon glyphicon-user"></span> Sign Up
                </li>
                <li onClick={e => location.href = '/customerlogin'}>
                  <span className="glyphicon glyphicon-log-in"></span> Login
                </li>
              </ul>
              : <ul className="nav-mobile hide-on-med-and-down inline right customer-nav-login">
                <li onClick={() => $('#user-rewards').modal('toggle')}>
                  <span className="glyphicon glyphicon-star"></span> Rewards
                </li>
                <li onClick={e => location.href = '/logout'}>
                  <span className="glyphicon glyphicon-log-out"></span> Logout
                </li>
              </ul>
            }
          </div>
        </nav>
        <RewardModal reservationRewards={this.state.reservationRewards} queueRewards={this.state.queueRewards}/>
      </div>
    );
  }
}

export default CustomerNav;
