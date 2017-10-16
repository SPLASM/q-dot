import React from 'react';

const CustomerListEntry = (props) => {
  return (
    <div className="panel-body customer-list-entry">
      <div className="col-md-7 col-xs-12">
        <h3 className="customer-entry-title">{props.queue.customer.name}</h3>
        <div className="col-xs-12">
          <p className="col-xs-12 col-sm-6"><i className="fa fa-mobile fa-fw" aria-hidden="true"></i> {props.queue.customer.mobile}</p>
          {props.queue.customer.email ?
            <p className="col-xs-12 col-sm-6" style={{wordWrap: 'break-word'}}><i className="fa fa-envelope-o fa-fw" aria-hidden="true"></i> {props.queue.customer.email}</p> : null}
        </div>
        <div className="col-xs-12">
          <p className="col-xs-12 col-sm-6"><i className="fa fa-users fa-fw" aria-hidden="true"></i> {props.queue.size}</p>
          <p className="col-xs-12 col-sm-6"><i className="fa fa-clock-o fa-fw" aria-hidden="true"></i> {props.queue.wait} mins</p>
        </div>
      </div>
      <div className="col-md-5 col-xs-12">
        <button className="btn-danger btn-sm entry-button col-sm-3 col-sm-offset-3 col-xs-offset-0 col-md-offset-0 col-md-12 col-xs-12" data-dismiss="modal" onClick={() => props.showModal(props.queue)}><i className="fa fa-user-times fa-fw" aria-hidden="true"></i> Remove</button>
        <button className="btn-success btn-sm entry-button col-sm-3 col-md-12 col-xs-12" onClick={() => props.notiCustomer(props.queue.id)}><i className="fa fa-bullhorn fa-fw" aria-hidden="true"></i> Ready</button>
        <button className="btn-primary btn-sm entry-button col-sm-3 col-md-12 col-xs-12" onClick={() => props.showOrders(props.queue.id)}><i className="fa fa-cutlery fa-fw" aria-hidden="true"></i> View Order</button>
      </div>
    </div>
  );
};

export default CustomerListEntry;
