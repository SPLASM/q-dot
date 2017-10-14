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
      ready: false
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
          console.log('successfully grabbed queue data for customer', data);
          this.setState({ currentCustomer: data });
          // report queueId to server socket
          this.socket.emit('customer report', id);
        },
        failure: (error) => {
          console.log('failed to grab queue data for customer', error);
        }
      });
    }
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
              <button></button>
            </div>
        }
      </div>
    );
  }
}

export default QueueInfo;
