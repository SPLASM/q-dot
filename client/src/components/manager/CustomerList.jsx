import React from 'react';
import CustomerListEntry from './CustomerListEntry.jsx';
import _ from 'lodash';
import $ from 'jquery';
require('webpack-jquery-ui/sortable');
require('jquery-ui-touch-punch');
import AddToQueue from './AddToQueue.jsx';
import OrdersModal from './Modals/OrdersModal.jsx';

class CustomerList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      modalQueue: undefined,
      newQueue: [],
      modalOrders: undefined
    };
  }

  showModal(queue) {
    this.setState({ modalQueue: queue }, () => {
      $('#remove-warning').modal('toggle')
    });
  }

  showOrders(queueId) {
    $.ajax({
      url: `/menu/order/${queueId}`,
      method: 'GET',
      success: (orders) => {
        this.setState({ modalOrders: orders }, () => {
          $('#manager-orders-modal').modal('toggle')
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  componentDidMount() {
    $('#sortable').sortable({
      revert: true,
      stop: () => {
        let children = $('#sortable')[0].children;
        let newQueue = $.map(children, (child, index) => {
          return `${child.id}&position=${(index + 1)}`;
        });
        this.setState({
          newQueue: newQueue
        });
      }
    });
    $('#sortable, #sortable .ui-state-default').disableSelection();
  }

  componentDidUpdate() {
    if (this.state.newQueue) {
      this.props.updateQueue(this.state.newQueue);
    }
  }

  render() {
    let notiCustomer = this.props.notiCustomer.bind(this);
    let entries = this.props.queues ? _.map(this.props.queues, (queue, index) => {
      return (
        <div className="ui-state-default" key={index} id={`queueId=${queue.id}`} style={{background: 'white', width: '100%'}}>
          <CustomerListEntry showOrders={this.showOrders.bind(this)} queue={queue} notiCustomer={notiCustomer} showModal={this.showModal.bind(this)}/>
        </div>
      );
    }) : <div>Nobody In Queue</div>;

    let removeCustomer = (status) => this.props.removeCustomer(this.state.modalQueue.id, status);
    return (
      <div className="customer-list col-xs-12">
        <h3 className="customer-list-head col-sm-8 col-xs-9">Customers in Queue</h3>
        <AddToQueue addCustomer={this.props.addCustomer.bind(this)}/>
        <div className="panel panel-default col-xs-12" id="sortable" style={{border: 'none', width: '100%'}}>
          {entries}
        </div>

        { this.state.modalQueue
          ? <div id="remove-warning" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h2 className="modal-title">Statement</h2>
                </div>
                <div className="modal-body">
                  <p className="warning-content"><b>Remove {this.state.modalQueue.customer.name}</b> From Queue?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-warning" data-dismiss="modal" onClick={() => removeCustomer('No Show')}>No Show</button>
                  <button className="btn btn-success" data-dismiss="modal" onClick={() => removeCustomer('Seated')}>Seated</button>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          : []
        }

        { this.state.modalOrders &&
          <OrdersModal modalOrders={this.state.modalOrders}/>
        }
      </div>
    );
  }

}

export default CustomerList;
