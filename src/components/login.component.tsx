import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

interface RouterProps
{
    history: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
    username: string;
    password: string;
    loading: boolean;
    message: string;
}

const Login = (props: Props, state: State) =>
{

    const validationSchema() {
        return Yup.object().shape({
            username: Yup.string().required("This field is required!"),
            password: Yup.string().required("This field is required!"),
        });
    }

    const handleLogin(formValue: { username: string, password: string })
    {
        const { username, password } = formValue;
    }

    const initialValues = {
        username: "",
        password: "",
    };

    return (
        "XD"
    );
}

export default Login;