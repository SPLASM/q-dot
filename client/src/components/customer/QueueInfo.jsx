import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import MenuModal from './Modals/MenuModal.jsx';
import $ from 'jquery';
import io from 'socket.io-client';

class QueueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCustomer: {
        restaurant: {
          name:''
        },
        position: '',
        wait: '',
        queueInFrontCount: ''
      },
      ready: false,
      modalRestaurant: undefined,
      modalOrdered: undefined,
      queueReward: false
    };
    // socket initialize
    this.socket = io();
    // dynamically update if table is ready
    this.socket.on('noti', (message) => {
      console.log(message);
      this.setState({ ready: true });
    });
  }

  componentDidMount() {
    this.getCurrentCustomerId();
  }

  getCurrentCustomerId() {
    let windowUrl = window.location.href;
    let id = Number(new URLSearchParams(window.location.search).get('queueId'));
    let user = new URLSearchParams(window.location.search).get('user');
    console.log(user);
    if (!id) {
      $.ajax({
        method: 'GET',
        url: `/customer/queueInfo`,
        success: (data) => {
          console.log('successfully received redirect response', data);
          window.location.replace(`/customer/queueinfo?queueId=${data.queueId}`);
        },
        failure: (error) => {
          console.log('failed to grab queue data for customer', error);
        }
      });
    } else {
      $.ajax({
        method: 'GET',
        url: `/queues?queueId=${id}`,
        success: (data) => {
          // console.log('successfully grabbed queue data for customer', data);
          this.setState({ currentCustomer: data });
          // report queueId to server socket
          this.socket.emit('customer report', id);
        },
        failure: (error) => {
          console.log('failed to grab queue data for customer', error);
        }
      });
    }
    if (user) {
      $.ajax({
        method: 'GET',
        url: '/rewards',
        success: data => {
          // console.log('successfully grabbed queue data for customer', data);
          if (data.queueCount >= 10) {
            console.log(data);
            this.setState({
              queueReward: true
            });
          }
        },
        failure: (error) => {
          console.log('failed to grab queue data for customer', error);
        }
      });
    }
  }

  addOrder(menuItem) {
    $.ajax({
      url: `./menu/order/${this.state.currentCustomer.queueId}/${menuItem.id}`,
      method: 'POST',
      success: (res) => {
        let newMenu = this.state.modalOrdered;
        newMenu.push(menuItem);
        this.setState({
          modalMenu: newMenu
        });
      },
      error: (err) => {
        // console.log(err);
      }
    });
  }

  removeOrder(menuItem, index) {
    $.ajax({
      url: `./menu/order/${this.state.currentCustomer.queueId}?menuId=${menuItem.id}`,
      method: 'DELETE',
      success: (res) => {
        let newMenu = this.state.modalOrdered;
        newMenu.splice(index, 1);
        this.setState({
          modalMenu: newMenu
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  showModal(menu) {
    this.setState({
      modalRestaurant: menu
    }, () => {
      $('#customer-menu-order').modal('toggle');
    });
  }

  getOrders(menu) {
    $.ajax({
      url: `/menu/order/${this.state.currentCustomer.queueId}`,
      method: 'GET',
      success: (orders) => {
        this.setState({
          modalOrdered: orders
        }, () => {
          this.showModal.call(this, menu);
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getMenu(restaurantId) {
    $.ajax({
      url: `./menu/${restaurantId}`,
      success: (menu) => {
        this.getOrders.call(this, menu);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  render() {
    return (
      <div className="customer-queue-info-container">
        <CustomerBanner customer={this.state.currentCustomer}/>
        <h5>YOUR QUEUE NUMBER IS</h5>
        {
          this.state.ready
            ? <h3 className="ready-noti">Your table is ready!</h3>
            : <div className="queue-position-display">
              <span className="position-number">{this.state.currentCustomer.position}</span>
              <h6>your approximate wait time is:</h6>
              <span className="wait-time-indicator">{this.state.currentCustomer.wait}</span>
              <p className="groups-in-front-indicator">There are currently {this.state.currentCustomer.queueInFrontCount} groups in front of you</p>
              <button className="getMenuBtn" onClick={this.getMenu.bind(this, this.state.currentCustomer.restaurant.id)}>Menu</button>
            </div>
        }

        { this.state.modalRestaurant ? <MenuModal order removeOrder={this.removeOrder.bind(this)} addOrder={this.addOrder.bind(this)} modalOrdered={this.state.modalOrdered} modalRestaurant={this.state.modalRestaurant} reward={this.state.queueReward}/> : '' }

      </div>
    );
  }
}

export default QueueInfo;
