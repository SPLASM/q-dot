import React from 'react';
import $ from 'jquery';

class ManagerSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      restaurant: '',
      city: '',
      unauthorised: false,
      restaurantList: []
    };
  }

  componentDidMount() {
    $.ajax({
      url: '/restaurants',
      method: 'GET',
      success: results => {
        var restaurantList = [];
        results.forEach(restaurant => {
          restaurantList.push(restaurant.name);
        });
        this.setState({
          restaurantList: restaurantList
        });
      },
      error: err => {
        console.error(err);
      }
    });
  }

  updateInputFields(event, field) {
    this.setState({
      [field]: event.target.value
    });
    if (field === 'restaurant') {

    }
  }

  submitHandler(event) {
    event.preventDefault();
    $.ajax({
      url: `/manager?username=${this.state.username}&password=${this.state.password}&restaurant=${this.state.restaurant}&location=${this.state.city}`,
      method: 'POST',
      success: (data) => {
        console.log('result from submitHandler request: ', data);
        window.location.href = data;
      },
      failure: (err) => {
        console.log('failed to sign up', err);
      },
      statusCode: {
        401: () => {
          this.setState({
            unauthorised: true
          });
        }
      }
    });
  }

  togglePath(event) {
    this.props.togglePath(event, 'login');
  }

  render() {
    return(
      <div className='container'>
        <form className='form-signin col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4' onSubmit={this.submitHandler.bind(this)}>
          <h2 className='form-signin-heading col-xs-12 text-center'>Sign Up</h2>
          <label className='sr-only'>Email address</label>
          <input
            value={this.state.username}
            type='username'
            className='form-control'
            placeholder='username'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'username')}
          />
          <label className='sr-only'>Password</label>
          <input
            value={this.state.password}
            type='password'
            className='form-control'
            placeholder='Password'
            required
            onChange={(e) => this.updateInputFields(e, 'password')}
          />
          <label className='sr-only'>City</label>
          <input
            value={this.state.city}
            type='text'
            className='form-control col-xs-12'
            placeholder='City'
            required
            onChange={(e) => this.updateInputFields(e, 'city')}
          />
          <label className='sr-only'>Restaurant</label>
          <input
            value={this.state.restaurant}
            type='text'
            list = 'restaurants'
            className='form-control col-xs-12'
            placeholder='Restaurant'
            required
            onChange={(e) => this.updateInputFields(e, 'restaurant')}
          />
          <datalist id='restaurants'>
            {this.state.restaurantList.map(restaurant => {
              return (<option value={restaurant}/>);
            })}
          </datalist>
          <button className='btn btn-lg btn-primary btn-block' type='submit'>Sign Up</button>
          <br />
          {
            this.state.unauthorised ?
              <div className="alert alert-danger col-xs-12">
              username already exists - please try again!
              </div>
              : null
          }
        </form>
        <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
          <div className="redir col-xs-12">Already have an account?</div>
          <button onClick={this.togglePath.bind(this)} className='btn btn-lg btn-primary btn-block col-xs-12'>Login</button>
        </div>
      </div>
    );
  }
}

export default ManagerSignup;
