import React from 'react';
import $ from 'jquery';
import ManagerSignup from './ManagerSignup.jsx';

class ManagerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      unauthorised: false,
      path: 'login'
    };
  }

  updateInputFields(event, field) {
    this.setState({
      [field]: event.target.value
    });
  }

  submitHandler(event) {
    event.preventDefault();
    $.ajax({
      url: `/managerlogin?username=${this.state.username}&password=${this.state.password}`,
      method: 'POST',
      success: (data) => {
        this.setState({
          unauthorised: false
        });
        window.location.href = data;
      },
      failure: (err) => {
        console.log('failed to load page', err);
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

  togglePath(event, newPath) {
    this.setState({
      path: newPath
    });
  }

  render() {
    if (this.state.path === 'signup') {
      return (<ManagerSignup togglePath={this.togglePath.bind(this)}/>);
    } else {
      return (
        <div className='container'>
          <form className='form-signin col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4' onSubmit={this.submitHandler.bind(this)}>
            <h2 className='form-signin-heading col-xs-12 text-center'>Log in</h2>
            <label className='sr-only'>Email address</label>
            <input
              value={this.state.username}
              type='username'
              className='form-control col-xs-12'
              placeholder='username'
              required autoFocus
              onChange={(e) => this.updateInputFields(e, 'username')}
            />
            <label className='sr-only'>Password</label>
            <input
              value={this.state.password}
              type='password'
              className='form-control col-xs-12'
              placeholder='Password'
              required
              onChange={(e) => this.updateInputFields(e, 'password')}
            />
            <button className='btn btn-lg btn-primary btn-block col-xs-12' type='submit'>Log in</button>
            <br />
            {
              this.state.unauthorised ?
                <div className="alert alert-danger col-xs-12">
                invalid credentials - please try again!
                </div>
                : null
            }
          </form>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <div className="redir col-xs-12">New user?</div>
            <button onClick={(e) => (this.togglePath.call(this, e, 'signup'))} className='btn btn-lg btn-primary btn-block col-xs-12'>Sign up</button>
          </div>
        </div>
      );
    }

  }
}

export default ManagerLogin;
