import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user-type";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    userEditOff: boolean,
    currentUser: IUser & { accessToken: string }
    //currentUser: IUser
}

export const Profile = (props: Props) => {

    const navigate = useNavigate();

    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        userEditOff: true,
        currentUser: {} as IUser & { accessToken: string },
    });

    useEffect(() => {
        AuthService.checkFirstTimeLogin();

        const user = AuthService.getCurrentUser();
        console.log(user);
        if (!user)
            setState({...state, redirect: "/home"});

        setState({...state, currentUser: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                role: user.isAdmin ? "admin" : "user",
                accessToken: user.tokens.accessToken,
            }, userReady: true});

    },[]);

    if (state.redirect) {
        return <Navigate to={state.redirect}/>
    }

    const {currentUser} = state;
    console.log(currentUser);
    return (
        <div className="">
            {(state.userReady) ?
                <div>
                    <header className="jumbotron">
                        <h3>
                            <strong>{currentUser.fullName}</strong> Profile
                        </h3>
                    </header>
                    <form className="my-2">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name:</label>
                            <input type="text" className="form-control mt-1" id="fullName" defaultValue={state.currentUser.fullName as string} readOnly={state.userEditOff}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="text" className="form-control mt-1" id="email" defaultValue={state.currentUser.email} readOnly={state.userEditOff}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="roles">Role:</label>
                            <input type="text" className="form-control mt-1" id="roles" defaultValue={state.currentUser.role} readOnly={state.userEditOff}/>
                        </div>

                        <div className="form-group mt-2">
                            <button type="button" className="btn btn-primary btn-btn-block me-1 px-4" onClick={() => setState({...state, userEditOff: !state.userEditOff})}>{state.userEditOff ? "Edit" : "Cancel"}</button>
                            <button type="button" className="btn btn-primary btn-btn-block" onClick={() => navigate("/password-new")}>Change Password</button>
                        </div>
                        <div className="form-group mt-2">

                        </div>
                    </form>
                    <p>
                        <strong>Token:</strong>{" "}
                        {/* {currentUser.tokens.accessToken.substring(0, 20)} ...{" "}
                        {currentUser.tokens.accessToken.substr(currentUser.accessToken.length - 20)} */}
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