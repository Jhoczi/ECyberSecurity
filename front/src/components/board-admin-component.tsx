import React, {useEffect, useState} from "react";

import UserService from "../services/user.service";

type Props = {};

type State = {
    content: boolean;
}

export const BoardAdmin = (props: Props) => {

    const [state, setState] = useState<State>({
        content: false,
    });

    useEffect(() => {
        UserService.getAdminBoard().then(
            response => {
                setState({
                    content: response.data
                });
            },
            error => {
                setState({
                    content: (
                            error.response &&
                            error.response.data &&
                            error.response.data.message
                        ) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{state.content}</h3>
            </header>
            <div className="row">
                <div className="container">
                    <div className="col-12">
                        <h1>Admin Panel</h1>
                    </div>
                    <div className="col-12">
                        <h2>Settings</h2>
                    </div>
                    <div className="col-12 mt-4">
                        <form>
                            <h4>Security</h4>
                            <p>Password security settings:</p>
                            <span><b>Password Length: </b></span>
                            <label className="w-50"><input type="number" name="passLength"/></label> <br />
                            <span><b>Password complexity: </b></span>
                            <label><input type="checkbox" name="specialCharacters" /> Special Characters</label>
                            <label className="mx-3"><input type="checkbox" name="Lower & Upper Letters" /> Lower & Upper Letters </label><br />
                            <span><b>Password Expiration </b></span>
                            <label><input type="number" name="passExpiration" /> days</label>
                            <h4>Administration</h4>
                            <input type="checkbox" name="Block user settings on this machine" /> Block user settings on this machine
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}