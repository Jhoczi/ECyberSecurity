import {Component, useEffect, useState} from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import {Login} from "./components/login-component";
import {Register} from "./components/register-component";
import {Home} from "./components/home-component";
import {Profile} from "./components/profile-component";
import {BoardUser} from "./components/board-user-component";
import {BoardAdmin} from "./components/board-admin-component";

import AuthVerify from "./common/AuthVerify";

import EventBus from "./common/event-bus";
import IUser from "./types/user-type";

type Props = {};

type State = {
    showAdminBoard: boolean,
    currentUser: IUser | undefined
}



function App() {

    const [state, setState] = useState<State>({
        showAdminBoard: false,
        currentUser: undefined
    });

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setState({
                currentUser: user,
                //showAdminBoard: user.roles.includes("ROLE_ADMIN")
                showAdminBoard: user.isAdmin
            });
        }

        EventBus.on("logout", logOut);

        return () => {
            EventBus.remove("logout", logOut);
        };
    },[]);

    const logOut = () => {
        AuthService.logout();
        setState({
            showAdminBoard: false,
            currentUser: undefined,
        });
    }

    const { currentUser, showAdminBoard } = state;

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <Link to={"/"} className="navbar-brand">
                    ECyberSecure
                </Link>
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/home"} className="nav-link">
                            Home
                        </Link>
                    </li>

                    {showAdminBoard && (
                        <li className="nav-item">
                            <Link to={"/admin"} className="nav-link">
                                Admin Board
                            </Link>
                        </li>
                    )}

                    {currentUser && (
                        <li className="nav-item">
                            <Link to={"/user"} className="nav-link">
                                User
                            </Link>
                        </li>
                    )}
                </div>

                {currentUser ? (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/profile"} className="nav-link">
                                {currentUser.fullName}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link" onClick={logOut}>
                                LogOut
                            </a>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={"/register"} className="nav-link">
                                Sign Up
                            </Link>
                        </li>
                    </div>
                )}
            </nav>

            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user" element={<BoardUser />} />
                    <Route path="/admin" element={<BoardAdmin />} />
                </Routes>
            </div>

            <AuthVerify logOut={logOut}/>
        </div>
    );
}

export default App;
