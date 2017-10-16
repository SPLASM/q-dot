import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import GMap from './GMap.jsx';
import AnnouncementModal from './Modals/AnnouncementModal.jsx';
import MenuModal from './Modals/MenuModal.jsx';
import MapModal from './Modals/MapModal.jsx';
import $ from 'jquery';
import scriptLoader from 'react-async-script-loader';
const { api_key } = require('../../../../server/credentials/googleAPI.js');
import { Link } from 'react-router-dom';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRestaurant: false,
      currentRestaurant: {},
      restaurantList: [],
      modalRestaurant: undefined,
      location: undefined,
      modalMap: undefined,
      travelTime: undefined
    };
  }

  componentDidMount() {
    this.getRestaurantList('San Francisco');
  }

  getRestaurantList(city) {
    $.ajax({
      method: 'GET',
      url: `/restaurants?city=${city}`,
      success: (data) => {
        console.log('successfully grabbed restaurant data', data);
        this.setState({ restaurantList: data });
      },
      failure: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  showModal(menu) {
    this.setState({
      modalRestaurant: menu
    });
    setTimeout(() => $('#customer-menu').modal('toggle'), 0);
  }

  showMap(restaurant) {
    this.setState({
      modalMap: restaurant
    });
    setTimeout(() => $('#rest-map').modal('toggle'), 0);
  }

  getMenu(restaurantId) {
    $.ajax({
      url: `./menu/${restaurantId}`,
      success: (menu) => {
        this.showModal.call(this, menu)
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.setState({
          location: location
        });
      });
    } else {
      alert('Geolocation not supported by your browser');
    }
  }

  travelTime(mode) {
    if (!!this.state.location) {
      console.log('clicked');
      let params = {
        origin: `${this.state.location.latitude},${this.state.location.longitude}`,
        destination: `${this.state.modalMap.latitude},${this.state.modalMap.longitude}`,
        mode: mode
      };
      $.ajax({
        url: `./travel?${$.param(params)}`,
        success: (data) => {
          this.setState({
            travelTime: data
          });
        },
        error: (err) => {
          console.log('Error fetching travel time from Google Maps API', err);
        }
      });
    }
  }

  showAnnModal(restaurant) {
    this.setState({
      currentRestaurant: restaurant
    });
    setTimeout(() => $('#announcements').modal('toggle'), 0);
  }

  render() {
    return (
      <div>
        <div className="customer-home">
          <CustomerBanner />
          <div className="select-restaurant-container col-xs-12">
            <button className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4" onClick={this.getLocation.bind(this)}>Find Restaurants Near Me</button>
            {this.state.location ?
              <div style={{width: '250px', height: '250px', margin: '100px auto 0'}}>
                <GMap
                  you={!!this.state.location}
                  location={this.state.location}
                  apiKey={api_key}
                />
              </div>

              : ''}
            <h4 style={{marginTop: '50px'}} className="col-xs-12 text-center">Help me queue up at...</h4>

            {this.state.restaurantList.map(restaurant => (
              <div className="col-xs-12" key={restaurant.id}>
                <div className="col-xs-12">
                  <div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                    <button onClick={() => this.showAnnModal(restaurant)} className="col-xs-12 col-xs-offset-0 col-sm-4 col-sm-offset-0 col-md-4 col-md-offset-2">Announcements ({restaurant.announcements.length})</button>
                    <button onClick={this.showMap.bind(this, restaurant)} className="col-xs-12 col-sm-4 col-md-3">Map</button>
                    <button onClick={this.getMenu.bind(this, restaurant.id)} className="col-xs-12 col-sm-4 col-md-3">Menu</button>
                  </div>
                </div>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            ))}

          </div>
        </div>

        {this.state.currentRestaurant.announcements && <AnnouncementModal announcements={this.state.currentRestaurant.announcements}/>}

        { this.state.modalRestaurant && <MenuModal modalRestaurant={this.state.modalRestaurant}/> }

        { this.state.modalMap && <MapModal apikey={api_key} modalMap={this.state.modalMap} location={this.state.location} travelTime={this.state.travelTime} getTravelTime={this.travelTime.bind(this)}/> }
      </div>
    );
  }
}

// export default CustomerHome;

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${api_key}`]
)(CustomerHome);
