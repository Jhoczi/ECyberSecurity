import React, { useEffect, useState } from 'react';

import './App.css';
import AdminPanel from "./components/admin-panel";
import LoginPanel from "./components/login-panel";

interface IUser {
    login: string
    password: string
}

function App() {

    const [user, setUser] = useState<IUser>();


    function loginVerification(userModel: IUser) {

    }

    return (
        <div className="App">
            <LoginPanel userModel={user}/>
            <AdminPanel userSettings={""} />
        </div>
    );
}

export default App;
