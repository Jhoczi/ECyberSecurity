import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

type Props = {}

type State = {
    redirect: string | null,
    username: string,
    password: string,
    loading: boolean,
    message: string,
}

export const Login = (props: Props) =>
{
    const navigate = useNavigate();

    const [state, setState] = useState<State>({
        redirect: null,
        username: "",
        password: "",
        loading: false,
        message: ""
    });

    const [currentUser, setUser] = useState();

    useEffect(() => {
        // componentDidMount
        const currentUser = AuthService.getCurrentUser();

        if (currentUser && !currentUser.isFirstTime)
        {
            setState({
                ...state,
                redirect: "/profile"
            });
        }

        // componentWillUnmount
        return () => {
            window.location.reload();
        }
    }, []);

    const validationSchema = () => {
        return Yup.object().shape({
            username: Yup.string().required("This field is required!"),
            password: Yup.string().required("This field is required!"),
        });
    }

    const handleLogin = (formValue: { username: string, password: string }) => {
        const { username, password } = formValue;

        setState({
            ...state,
            message: "",
            loading: true,
        });

        AuthService.login(username, password).then(
            () => {

                const user = AuthService.getCurrentUser();
                if (user.isFirstTime)
                {
                    console.log("ZMIENIAJ CHLOPIE")
                    setState({...state, redirect: "/password-new"});
                }
                else
                {
                    setState({...state, redirect: "/profile"});
                }
            },
            error => {
                const resMessage = (
                    error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();

                setState({
                    ...state,
                    loading: false,
                    message: resMessage,
                });
            }
        );
    }

    const { loading, message } = state;

    const initialValues = {
        username: "",
        password: "",
    };

    if (state.redirect) {
        return <Navigate to={state.redirect} />
    }

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="username">Email</label>
                            <Field name="username" type="text" className="form-control" />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="alert alert-danger"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="alert alert-danger"
                            />
                        </div>

                        <div className="form-group mt-2">
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Login</span>
                            </button>
                        </div>

                        {message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                    </Form>
                </Formik>
            </div>
        </div>
    );
}