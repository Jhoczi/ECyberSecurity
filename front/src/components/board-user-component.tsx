import {useEffect, useState} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

type Props = {};

type State = {
    content: string;
}

export const BoardUser = (props: Props) => {

    const [state, setState] = useState<State>({
        content: ""
    }); // use rather for primitive types

    useEffect(() => {
        AuthService.checkFirstTimeLogin();

        UserService.getUserBoard()
            .then(
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
    },[]);

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{state.content}</h3>
            </header>
        </div>
    );
}