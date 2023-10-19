import React, { Component } from 'react';
import axios from 'axios';

class UserList extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    axios.get('/api/users') // Здесь укажите URL вашего API-маршрута
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  render() {
    return (
      <div>
        <h1>Список пользователей</h1>
        <ul>
          {this.state.users.map(user => (
            <li key={user.id}>
              {user.surname} {user.name} {user.middleName}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default UserList;
