import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

type Props = {}

type State = {
    redirect: string | null,
    oldPassword: string,
    newPassword: string,
    loading: boolean,
    message: string,
}

export const PasswordNew = (props: Props) => {
    const navigate = useNavigate();

    const [state, setState] = useState<State>({
        redirect: null,
        oldPassword: "",
        newPassword: "",
        loading: false,
        message: ""
    });

    const [currentUser, setUser] = useState();

    useEffect(() => {
        // componentDidMount
        const currentUser = AuthService.getCurrentUser();

        // componentWillUnmount
        return () => {
            window.location.reload();
        }
    }, []);

    const validationSchema = () => {
        return Yup.object().shape({
            oldPassword: Yup.string().required("This field is required!"),
            newPassword: Yup.string().required("This field is required!"),
        });
    }

    const handlePasswordChange = (formValue: { oldPassword: string, newPassword: string }) => {
        const { oldPassword, newPassword } = formValue;

        setState({
            ...state, // xD?
            message: "",
            loading: true,
        });

        AuthService.setNewPassword(oldPassword, newPassword).then(() => {
            console.log("Password changed!");

            setState({...state, redirect: "/profile"});
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

        // AuthService.login(username, password).then(
        //     () => {
        //     },
        //     error => {
        //         const resMessage = (
        //             error.response &&
        //             error.response.data &&
        //             error.response.data.message) ||
        //             error.message ||
        //             error.toString();

        //         setState({
        //             ...state,
        //             loading: false,
        //             message: resMessage,
        //         });
        //     }
        // );
    }

    const { loading, message } = state;

    const initialValues = {
        oldPassword: "",
        newPassword: "",
    };

    if (state.redirect) {
        return <Navigate to={state.redirect} />
    }

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <h2>Set New Password</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handlePasswordChange}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Old Password</label>
                            <Field name="oldPassword" type="password" className="form-control" />
                            <ErrorMessage
                                name="oldPassword"
                                component="div"
                                className="alert alert-danger"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-newPassword">New Password</label>
                            <Field name="newPassword" type="password" className="form-control" />
                            <ErrorMessage
                                name="new-newPassword"
                                component="div"
                                className="alert alert-danger"
                            />
                        </div>

                        <div className="form-group mt-2">
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Change password</span>
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