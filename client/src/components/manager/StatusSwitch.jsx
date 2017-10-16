import React from 'react';

const StatusSwitch = (props) => {

  return (
    <div className="col-xs-12">
      <span className="active col-xs-12 col-sm-2 text-center" style={{padding: '15px'}}>Status: {props.status === 'Open' ? 'Open' : 'Close'}</span>
      <div className="col-sm-10">
        <button type="button" className="btn btn-primary col-xs-12 col-sm-6" data-toggle="modal" data-target="#close-queue-warning">
          {props.status === 'Open'
            ? <i className="fa fa-ban fa-fw" aria-hidden="true"></i>
            : <i className="fa fa-check fa-fw" aria-hidden="true"></i>}
          {props.status === 'Open' ? 'Close' : 'Open'} Queue</button>
        <button className="btn btn-danger col-xs-12 col-sm-6" onClick={e => location.href = '/logout'}><i className="fa fa-sign-out fa-fw" aria-hidden="true"></i>Logout</button>
      </div>

      <div id="close-queue-warning" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h2 className="modal-title">Confirmation</h2>
            </div>
            <div className="modal-body">
              <p className="warning-content"><b>{props.status === 'Open' ? 'Close' : 'Open'}</b> Queue?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={props.switchStatus.bind(this)} data-dismiss="modal">Confirm</button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSwitch;
