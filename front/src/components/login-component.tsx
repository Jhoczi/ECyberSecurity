import {useCallback, useEffect, useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';

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
    //const navigate = useNavigate();
    const [state, setState] = useState<State>({
        redirect: null,
        username: "",
        password: "",
        loading: false,
        message: ""
    });

    const makeCaptcha = (length: number) => {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const [visibleCaptcha, setVisibleCaptcha] = useState(makeCaptcha(3));

    // CAPTCHA SETTINGS
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [token, setToken] = useState('');

    // END OF CAPTCHA SETTINGS

    const [currentUser, setUser] = useState();


    useEffect(() => {

        if (!executeRecaptcha) {
            return;
        }

        const handleReCaptchaVerify = async () => {
            const token = await executeRecaptcha();
            setToken(token);
        };

        handleReCaptchaVerify();
        // if (executeRecaptcha) {
        //     console.log("XD");
        //     const result = executeRecaptcha('').then(data => {
        //         setToken(data);
        //     });
        //     console.log(`Captcha: ${token}`);
        // }

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
    }, [executeRecaptcha]);

    const validationSchema = () => {
        return Yup.object().shape({
            username: Yup.string().required("This field is required!"),
            password: Yup.string().required("This field is required!"),
        });
    }

    const clickHandler = async (formValue: { username: string, password: string, ourCaptcha:string }) => {
        console.log(token);
        await handlerCaptcha();
        handleLogin(formValue, token, visibleCaptcha);
    };
    const handlerCaptcha = useCallback(async () => {
        if (!executeRecaptcha) {
            return;
        }

        const result = await executeRecaptcha()
        setToken(result);

    }, [executeRecaptcha]);


    const handleLogin = (formValue: { username: string, password: string, ourCaptcha:string }, token: string, visibleCaptcha: string) => {
        const { username, password, ourCaptcha } = formValue;

        setState({
            ...state,
            message: "",
            loading: true,
        });
        console.log("Login token:" + token);
        AuthService.login(username, password, token, visibleCaptcha, ourCaptcha).then(
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
        ourCaptcha: "",
        visibleCaptcha: visibleCaptcha
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
                    onSubmit={clickHandler}
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

                        <div className="form-group">
                            <label htmlFor="ourCaptcha">Captcha</label>
                            <label htmlFor="ourCaptcha">Enter captcha phrase in reverse order: <b>{initialValues.visibleCaptcha}</b></label>
                            <Field name="ourCaptcha" type="text" className="form-control"/>
                            <ErrorMessage
                                name="ourCaptcha"
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
