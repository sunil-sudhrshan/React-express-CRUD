import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';
 
function App() {
  const [data, setUserData] = useState([]);
  const [userid, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResult, setShowResult] = useState(false);
 
  const updateUserId = (event) => {
    setUserId(event.target.value);
  };
 
  const updateEmail = (event) => {
    setEmail(event.target.value);
  };
 
  const updatePassword = (event) => {
    setPassword(event.target.value);
  };
 
  const fetchdata = useCallback(() => {
    axios.get('http://localhost:9901/getAll')
      .then((response) => {
        const userData = response.data;
        userData.forEach((user) => {
          user.hidden = user.password;
          user.password = modifyPassword(user.password.length);
        });
        setUserData(userData);
        setShowResult(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Empty dependency array means this function will not change on re-renders
 
  const insertUsers = (event) => {
    event.preventDefault();
 
    axios.post('http://localhost:9901/insert', { userid: userid, emailid: email, password: password })
      .then((response) => {
        console.log(response.data);
        clear();
        fetchdata();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
 
  function modifyPassword(length) {
    let hide = '';
    for (let i = 0; i < length; i++) {
      hide += '*';
    }
    return hide;
  }
 
  function Details(user) {
    return function () {
      window.alert('UserId: ' + user.userid + '\nPassword: ' + user.hidden + '\nEmailID: ' + user.emailid);
    };
  }
 
  function clear() {
    setUserId('');
    setPassword('');
    setEmail('');
  }
 
  const modify = (event) => {
    event.preventDefault();
    axios.put('http://localhost:9901/update', { userid: userid, emailid: email, password: password })
      .then((response) => {
        console.log(response.data);
        clear();
        fetchdata();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
 
  const remove = (event) => {
    event.preventDefault();
    axios.post('http://localhost:9901/delete', { userid: userid })
      .then((response) => {
        console.log(response.data);
        clear();
        fetchdata();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
 
  return (
    <div className="App">
      <div className="Form">
        <form onSubmit={insertUsers} onReset={clear}>
          <table>
            <tr>
              <th>User ID</th>
              <td colSpan={4}><input type="text" value={userid} onChange={updateUserId} /></td>
            </tr>
            <tr>
              <th>Password</th>
              <td colSpan={4}><input type="password" value={password} onChange={updatePassword} /></td>
            </tr>
            <tr>
              <th>Email ID</th>
              <td colSpan={4}><input type="text" value={email} onChange={updateEmail} /></td>
            </tr>
            <tr>
              <td><button type="submit">Add</button></td>
              <td><button type="reset">Reset</button></td>
              <td><button type="button" onClick={modify}>Modify</button></td>
              <td><button type="button" onClick={remove}>Remove</button></td>
              <td><button type="button" onClick={fetchdata}>Show</button></td>
            </tr>
          </table>
        </form>
      </div><br />
      {showResult && (
        <div className='result'>
          <table>
            <tr>
              <th>ID</th>
              <th>Password</th>
              <th>Email</th>
              <th></th>
            </tr>
            {data.map((item) => (
              <tr key={item.userid}><td>{item.userid}</td><td>{item.password}</td><td>{item.emailid}</td><td><button type='button' onClick={Details(item)}>Details</button></td></tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
 
export default App;