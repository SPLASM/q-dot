import React from 'react';
import $ from 'jquery';
import balloon from '../../../dist/images/map_marker.png';
import scriptLoader from 'react-async-script-loader';

class GMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
      this.map = new google.maps.Map(this.refs.map, {
        center: {lat: !!this.props.restaurant ? this.props.restaurant.latitude : (!!this.props.location ? this.props.location.latitude : 37.7837625), lng: !!this.props.restaurant ? this.props.restaurant.longitude : (!!this.props.location ? this.props.location.longitude : -122.4090708)},
        zoom: 15
      });

      if(!!this.props.location) {
        let you = new google.maps.Marker({
          position: {lat: this.props.location.latitude, lng: this.props.location.longitude},
          map: this.map
        });
      }

      if (!!this.props.restaurant) {
        let rest = new google.maps.Marker({
          position: {lat: this.props.restaurant.latitude, lng: this.props.restaurant.longitude},
          map: this.map
        });
      }

      $('#rest-map').on('shown.bs.modal', () => {
        let center = this.map.getCenter();
        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter(center);
      });
    }
  }

  render() {
    return (
      <div ref="map" style={{width:'100%', height:'100%', border: '1ps solid lightgray'}}></div>
    );
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyAZcBYx6q5OMe1pL7JrJr8853Z3lP6IRs0`]
)(GMap);
