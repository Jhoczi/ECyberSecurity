import React, {useEffect, useState} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import IPwd from "../types/pwd-type";

type Props = {};

type State = {
    content: boolean;
    loading: boolean;
    message: string;
}

export const BoardAdmin = (props: Props) => {

    const [state, setState] = useState<State>({
        content: false,
        loading: false,
        message: ""
    });

    useEffect(() => {

        AuthService.checkFirstTimeLogin();

        UserService.getAdminBoard().then(
            response => {
                setState({
                    ...state,
                    content: response.data
                });
            },
            error => {
                setState({
                    ...state,
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

    const validationSchema = () => {
        return Yup.object().shape({
            passwordLength: Yup.number().required("This field is required!"),
            passwordExpiration: Yup.number().required("This field is required!"),
        });
    };
    const updatePasswordSettings = (formValue: { passwordLength: number, passwordExpiration: number, specialCharacter: boolean, oneDigit: boolean }) => {
        console.log(formValue)
        const {passwordLength, passwordExpiration, specialCharacter, oneDigit} = formValue;

        setState({
            ...state,
            message: "",
            loading: true,
        });

        AuthService.setUserPasswordSettings(formValue).then(data => {
            console.log(data)
            setState({
                ...state,
                loading: false,
                message: "Password settings updated!"
            });
        }, error => {

            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            setState({
                ...state,
                loading: false,
                message: resMessage
            });
        });
    };

    const {loading, message} = state;
    const initialValues = {
        passwordLength: 0,
        passwordExpiration: 0,
        specialCharacter: false,
        oneDigit: false
    };

    return (
        <div className="col-12">

            <div className="col-12">
                <h1>Admin Panel</h1>
            </div>

            <div className="card card-container col-12">
                <header className="jumbotron">
                    <h3>{state.content}</h3>
                </header>

                <div className="col-12">
                    <h3>Password Settings</h3>
                </div>
                <div className="col-12 mt-1">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={updatePasswordSettings}
                    >
                        <Form>
                            <h5>Security</h5>
                            <p>Password security settings:</p>

                            <div className="form-group">
                                <label htmlFor="passwordLength">Password Length:</label>
                                <Field name="passwordLength" type="number" className="form-control"/>
                                <ErrorMessage
                                    name="passwordLength"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="specialCharacter"><Field name="specialCharacter" type="checkbox"
                                                                         className="form-check-input"/> Require One
                                    Special</label>
                                <ErrorMessage
                                    name="specialCharacter"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="oneDigit"><Field name="oneDigit" type="checkbox"
                                                                 className="form-check-input"/> Require One
                                    Digit</label>
                                <ErrorMessage
                                    name="oneDigit"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="passwordExpiration">Password Expiration (days):</label>
                                <Field name="passwordExpiration" type="number" className="form-control"/>
                                <ErrorMessage
                                    name="passwordExpiration"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group mt-3">
                                <button type="submit" className="btn btn-primary btn-block w-50" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Save</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-info" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}

                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
}