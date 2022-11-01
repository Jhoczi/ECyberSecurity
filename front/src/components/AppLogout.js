import React, { useEffect } from "react";
import AuthService from "../services/auth.service";


const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

const AppLogout = ({ children }) => {
    let timer;

    useEffect(() => {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, () => {
                resetTimer();
                handleTimer();
            });
        });
    }, []);

    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    const handleTimer = () => {
        timer = setTimeout(() => {
            resetTimer();
            Object.values(events).forEach((item) => {
                window.removeEventListener(item, resetTimer);
            });
            logoutAction();
        }, AuthService.getCurrentUserPasswordSettings().timeoutMinutes * 60 * 1000);
    };

    const logoutAction = () => {
        localStorage.clear();
        window.location.pathname = "/";
    };
    return children;
};

export default AppLogout;