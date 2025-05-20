
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repositories/19438/issues')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map((issue) => ({
          id: issue.id,
          login: issue.user?.login,
          avatar_url: issue.user?.avatar_url,
          type: issue.user?.type,
        }));
        setUsers(formattedData);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setUsers(users.map(user => user.id === editUser.id ? editUser : user));
    setModalVisible(false);
    setEditUser(null);
  };

  return (
    <div className="app">
      <h1> User Issues</h1>
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Login</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><img src={user.avatar_url} alt="avatar" width="40" /></td>
              <td>{user.login}</td>
              <td>{user.type}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>
            <label>Login:</label>
            <input name="login" value={editUser.login} onChange={handleModalChange} />
            <label>Type:</label>
            <input name="type" value={editUser.type} onChange={handleModalChange} />
            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
