import {useEffect, useState} from "react";
import {Routes, Route, Link} from "react-router-dom";
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
import IPwd from "./types/pwd-type";
import {PasswordNew} from "./components/password-new-component";

type Props = {};

type State = {
    showAdminBoard: boolean,
    currentUser: IUser | undefined
    passwordSettings: IPwd | undefined
}


function App() {

    const [state, setState] = useState<State>({
        showAdminBoard: false,
        currentUser: undefined,
        passwordSettings: undefined,
    });

    const getPasswordSettings = async (user: any) => {
        await AuthService.getUserPasswordSettings(user.email);

        return AuthService.getCurrentUserPasswordSettings();
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            getPasswordSettings(user).then((data) => {
                console.log(data);
                setState({
                    currentUser: user,
                    showAdminBoard: user.isAdmin,
                    passwordSettings: data
                });
            });
            // let xd;
            // getPassword().then(data => {
            //     xd = data;
            // })
        }

        EventBus.on("logout", logOut);
        return () => {
            EventBus.remove("logout", logOut);
        };
    }, []);

    const logOut = () => {
        AuthService.logout();
        setState({
            showAdminBoard: false,
            currentUser: undefined,
            passwordSettings: undefined,
        });
    }

    const {currentUser, showAdminBoard} = state;

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav mr-auto" id="navbar-container">
                    <li className="nav-item">
                        <Link to={"/"} className="navbar-brand">
                            Cyber
                        </Link>
                    </li>

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
                    <div className="navbar-nav ml-auto" id="navbar-container">
                        <li className="nav-item">
                            <Link to={"/profile"} className="nav-link">
                                {currentUser.fullName}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link" onClick={logOut}>
                                Logout
                            </a>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto" id="navbar-container">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={"/register"} className="nav-link">
                                Sign up
                            </Link>
                        </li>
                    </div>
                )}

            </nav>

            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/user" element={<BoardUser/>}/>
                    <Route path="/admin" element={<BoardAdmin/>}/>
                    <Route path="/password-new" element={<PasswordNew/>}/>
                </Routes>
            </div>

            <AuthVerify logOut={logOut}/>
        </div>
    );
}

export default App;
