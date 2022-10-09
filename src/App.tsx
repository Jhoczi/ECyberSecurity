import React from 'react';
import Button from 'react-bootstrap/Button';
import AdminPanel from "./components/admin-panel";
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="login-container mx-5">
        <div className="container">
          <div className="title-container col-12 mx-1">
            <h1>E-Cyber Security</h1>
          </div>
          <div className="form col-12">
            <form>
              <div className="input-container">
                <label>Username </label>
                <input type="text" name="uname" required />
                {/*{renderErrorMessage("uname")}*/}
              </div>
              <div className="input-container">
                <label>Password </label>
                <input type="password" name="pass" required />
                {/*{renderErrorMessage("pass")}*/}
              </div>
              <div className="button-container">
                <input type="submit" />
              </div>
            </form>
          </div>
        </div>
        <AdminPanel userSettings={"xd"}/>
      </div>
    </div>
  );
}

export default App;
