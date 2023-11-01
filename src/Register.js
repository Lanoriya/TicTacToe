import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  state = {
    login: '',
    password: '',
  };

  handleRegister = async () => {
    const { login, password } = this.state;
    try {
      const response = await axios.post('http://localhost:3001/api/register', { login, password });
      console.log(response.data);
    } catch (error) {
    }
  }

  render() {
    return (
      <div>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => this.setState({ login: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <button onClick={this.handleRegister}>Register</button>
      </div>
    );
  }
}

export default Register;
