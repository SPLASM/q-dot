import React from 'react';
import GroupSizeSelector from '../GroupSizeSelector.jsx';
import RestaurantCard from '../RestaurantCard.jsx';
import { Link } from 'react-router-dom';

class QueueModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 0
    };
  }

  getGroupSize(size) {
    this.setState({ size: size });
  }

  render() {
    return (
      <div style={{background: 'none', boxShadow: 'none'}} id="queue-modal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h2 className="modal-title">{this.props.restaurant.name}</h2>
            </div>
            <div className="modal-body">
              <GroupSizeSelector getGroupSize={size => this.getGroupSize(size)}/>
            </div>
            <div className="modal-footer inline">
              <Link to={`/restaurant/${this.props.restaurant.name}/${this.state.size}/${this.props.restaurant.id}`}>
                <button type="button" className="btn btn-default">Add to Queue?</button>
              </Link>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QueueModal;

// <Link to={`/restaurant/${this.props.restaurant.name}/${this.props.restaurant.id}`}></Link>
