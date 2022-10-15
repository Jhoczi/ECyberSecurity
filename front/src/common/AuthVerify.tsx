import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const parseJwt = (token: any) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props: any) => {
    let location = useLocation();

    useEffect(() => {
        let user: any = localStorage.getItem("user");
        user = JSON.parse(user);

        if (user) {
            const decodedJwt = parseJwt(user.accessToken);

            if (decodedJwt.exp * 1000 < Date.now()) {
                props.logOut();
            }
        }
    }, [location, props]);

    return (<React.Fragment></React.Fragment>);

};

export default AuthVerify;