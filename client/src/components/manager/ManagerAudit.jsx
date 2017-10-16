import React from 'react';

class ManagerAudit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditHistory: [],
      modalClear: false
    };
  }

  componentDidMount() {
    this.getAuditHistory();
  }

  getAuditHistory() {
    var self = this;
    $.ajax({
      url: '/manager/history',
      method: 'GET',
      success: function(data) {
        self.setState({
          auditHistory: data
        });
      },
      failure: function(err) {
        console.log(err);
      }
    });
  }

  clearAuditHistory() {
    var self = this;
    $.ajax({
      url: '/manager/history',
      method: 'DELETE',
      success: function(data) {
        console.log(data);
        self.setState({
          auditHistory: []
        });
      },
      failure: function(err) {
        console.log(err);
      }
    });
  }

  render () {
    return (
      <div>
        <div id="clear-warning" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h2 className="modal-title">Confirmation</h2>
              </div>
              <div className="modal-body">
                <p className="warning-content">Are you sure you wish to clear the login history?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" data-dismiss="modal" onClick={this.clearAuditHistory.bind(this)}>Yes</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xs-12 manager-audit">
          <h3 className="col-xs-9">Manager Login History</h3>
          <button type="button" className="col-xs-3 addMenu btn btn-danger navbar-btn" data-toggle="modal" data-target="#clear-warning"><i className="fa fa-trash fa-fw" aria-hidden="true"></i>clear history</button>
          <div className="panel panel-default manager-login-history">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>username</th>
                    <th>type</th>
                    <th>date</th>
                    <th>time</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.auditHistory.map(historyItem => {
                      var date = new Date(historyItem.createdAt);
                      var timeString = date.toTimeString();
                      var dateString = date.toDateString();
                      return (
                        <tr key={historyItem.id}>
                          <td>{historyItem.id}</td>
                          <td>{historyItem.manager.username}</td>
                          <td>{historyItem.type}</td>
                          <td>{dateString}</td>
                          <td>{timeString}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManagerAudit;
