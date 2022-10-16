import {useEffect, useState} from "react";

import UserService from "../services/user.service";

type Props = {};

type State = {
    content: string;
}

export const BoardModerator = (props: Props) => {

    const [state, setState] = useState<State>({
        content: ""
    });

    UserService.getModeratorBoard().then(
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

    // useEffect(() => {
    //
    // });

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{state.content}</h3>
            </header>
        </div>
    );
}