import React from 'react';
import { Link } from 'react-router-dom';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import StarRatingComponent from 'react-star-rating-component';

// RestaurantCard is what the customers click on the home page to select their restaurant. Routes to /SelectedRestaurant
class RestaurantCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantStatus: this.props.restaurant.status,
      announcements: this.props.restaurant.announcements
    };
  }

  render() {
    let statusCircle;
    const openStatusCircle = {
      background: '#4FD135'
    };

    const closedStatusCircle = {
      background: '#C01717'
    };

    this.state.restaurantStatus === 'Closed' ? statusCircle = closedStatusCircle : statusCircle = openStatusCircle;

    let image = this.props.restaurant.image;

    // let rating = this.props.restaurant.rating

    return (
      <div className="restaurant-container col-xs-12">
        <div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <div className="card hoverable">
            <div className="card-image" style={{backgroundImage: `url(${image})`}}>
              {/* <img src={image}/> */}
            </div>
            <div className="card-bottom">
              <div className="col-sm-7 col-xs-12 restaurantCardLeft">
                <div className="card-title">
                  <h3 className="card-title-text">{this.props.restaurant.name}</h3>
                  <p className="status"><span className="status-circle" style={statusCircle}/>{this.state.restaurantStatus}</p>
                </div>
                <div className="card-content address">
                  {this.props.restaurant.address}
                </div>
                <div className="card-content">
                  <span className="queue-number">groups in queue: {this.props.restaurant.queues.length} </span>
                </div>
              </div>
              <div className="col-sm-5 col-xs-12 restaurantCardRight">
                <div className="card-content stars">
                  <StarRatingComponent
                    name={'rating'}
                    value={Number(this.props.restaurant.rating)}
                    starCount={5}
                    starColor='#f4d942'
                    emptyStarColor='#f4d942'
                    editing={false}
                    renderStarIcon={(star, rating) => {
                      return star <= rating ? (<i className="fa fa-star fa-2x" aria-hidden="true"></i>) : (<i className="fa fa-star-o fa-2x" aria-hidden="true"></i>);
                  }}
                    renderStarIconHalf={() => <i style={{color: '#f4d942'}} className="fa fa-star-half-o fa-2x" aria-hidden="true"></i>}
                  />
                </div>
                <div className="card-content">
                  <span className="reviewCount">number of reviews: {this.props.restaurant.reviewCount}</span>
                </div>
                <div className="card-content">
                  <span className="wait-time">wait time: {this.props.restaurant.total_wait} mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RestaurantCard;
          // <Link to={`/restaurant/${this.props.restaurant.name}`}>
