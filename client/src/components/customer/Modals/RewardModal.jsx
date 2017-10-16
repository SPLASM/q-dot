import React from 'react';

const RewardModal = props =>
  <div style={{background: 'none', boxShadow: 'none'}} id="user-rewards" className="modal fade" role="dialog">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h2 className="modal-title">Rewards</h2>
        </div>
        <div className="modal-body">
          { !props.reservationRewards && !props.queueRewards
            ? <h2>No rewards available, bruh.</h2>
            : <table id="reward-table" className="bordered responsive-table centered">
              <thead>
                <tr>
                  <th></th>
                  <th>Reward</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                { props.reservationRewards >= 5
                  ? <tr>
                    <td><i className="material-icons">merge_type</i></td>
                    <td>Queue Reservation</td>
                    <td className="reward-description">
                      Restaurant doesn't take reservations? Schedule a
                      <br/>
                      time you want to be there and we'll automatically
                      <br/>
                      put you in the queue so your table will likely be
                      <br/>
                      ready within 10 minutes!
                    </td>
                  </tr> : null
                }
                { props.queueRewards >= 10
                  ? <tr>
                    <td><i className="material-icons">local_dining</i></td>
                    <td>Free Appetizer</td>
                    <td className="reward-description">
                      You certainly don't have commitment issues! You've
                      <br/>
                      shown up when called enough to earn an appetizer
                      <br/>
                      on us!
                    </td>
                  </tr> : null
                }
              </tbody>
            </table>
          }
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>;

export default RewardModal;
