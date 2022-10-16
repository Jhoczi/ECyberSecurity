import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user-type";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { accessToken: string }
}

export const Profile = (props: Props) => {

    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {accessToken: ""}
    });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser)
            setState({...state, redirect: "/home"});

        setState({...state, currentUser: currentUser, userReady: true});
    },[]);

    if (state.redirect) {
        return <Navigate to={state.redirect}/>
    }

    const {currentUser} = state;

    return (
        <div className="container">
            {(state.userReady) ?
                <div>
                    <header className="jumbotron">
                        <h3>
                            <strong>{currentUser.username}</strong> Profile
                        </h3>
                    </header>
                    <p>
                        <strong>Token:</strong>{" "}
                        {currentUser.accessToken.substring(0, 20)} ...{" "}
                        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                    </p>
                    <p>
                        <strong>Id:</strong>{" "}
                        {currentUser.id}
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        {currentUser.email}
                    </p>
                    <strong>Authorities:</strong>
                    <ul>
                        <li>{currentUser.role}</li>
                    </ul>
                </div> : null}
        </div>
    );
}