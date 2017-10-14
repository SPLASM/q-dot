import React from 'react';
import RestaurantLogoBanner from './RestaurantLogoBanner.jsx';
import CustomerInfoForm from './CustomerInfoForm.jsx';
import QueueInfo from './QueueInfo.jsx';
import RestaurantInformation from './RestaurantInformation.jsx';
import { Link } from 'react-router-dom';

class SelectedRestaurant extends React.Component {
  constructor(props) {
    super(props);
    this.customerInfoSubmitted = this.customerInfoSubmitted.bind(this);
    this.state = {
      currentRestaurant: {queues: []},
      infoSubmitted: false,
      queueId: 0,
      queuePosition: 0,
      ready: false
    };
  }

  componentDidMount() {
    this.getRestaurant(data => {
      $.ajax({
        url: '/userdata',
        type: 'GET',
        success: (res) => {
          this.setState({
            user: res
          });
          if (this.state.user) {
            this.submitCustomerInfo();
          }
        },
        error: () => {
          console.log('error fetching user data');
        }
      });
    });
  }

  getRestaurant(cb) {
    let path = window.location.pathname.split('/');
    let id = Number(path[path.length - 1]);

    $.ajax({
      method: 'GET',
      url: `/restaurants?restaurantId=${id}`,
      success: (data) => {
        console.log('successfully grabbed current restaurant data', data);
        this.setState({ currentRestaurant: data });
        cb(data);
      },
      failure: (error) => {
        console.log('failed to grab current restaurant data', error);
      }
    });
  }

  customerInfoSubmitted(id, position) {
    this.setState({
      infoSubmitted: true,
      queueId: id,
      queuePosition: position
    });
  }

  submitCustomerInfo() {
    console.log(this.state.currentRestaurant.id);
    $.ajax({
      method: 'POST',
      url: '/queues',
      data: {
        restaurantId: this.state.currentRestaurant.id,
        size: 2
      },
      success: (data) => {
        console.log('this was a successful post request', data);
        this.customerInfoSubmitted(data.queueId, data.position);
        window.location.replace(`/customer/queueinfo?queueId=${data.queueId}`);
      },
      failure: (error) => {
        console.log('something went wrong with the post request', error);
      }
    });
    //   contentType: 'application/json',
    //   success: (data) => {
    //     console.log('this was a successful post request', data);
    //     this.props.customerInfoSubmitted(data.queueId, data.position);
    //     window.location.replace(`/customer/queueinfo?queueId=${data.queueId}`);
    //   },
    //   failure: (error) => {
    //     console.log('something went wrong with the post request', error);
    //   }
    // });
  }

  render() {
    const restaurantImg = {
      backgroundImage: `url(../${this.state.currentRestaurant.image})`
    };
    return (
      <div className="selected-restaurant">
        <RestaurantLogoBanner style={restaurantImg} />
        <RestaurantInformation restaurant={this.state.currentRestaurant}/>
        <CustomerInfoForm customerInfoSubmitted={this.customerInfoSubmitted} />
      </div>
    );
  }
}

export default SelectedRestaurant;
