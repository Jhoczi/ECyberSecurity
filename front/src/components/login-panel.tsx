import React from 'react';

const LoginPanel:(x: any) => any = ({ userModel }) => {

    return (
        <div className="login-container mx-5 mt-3 mb-3">
            <div className="container">
                <div className="title-container col-12 mx-1 text-center">
                    <h1>E-Cyber Security</h1>
                </div>
                <div className="form col-12">
                    <form>
                        <div className="input-container">
                            <label>Username </label>
                            <input type="text" name="uname" value={userModel.login} required />
                            {/*{renderErrorMessage("uname")}*/}
                        </div>
                        <div className="input-container">
                            <label>Password </label>
                            <input type="password" name="pass" value={userModel.password} required />
                            {/*{renderErrorMessage("pass")}*/}
                        </div>
                        <div className="text-center">
                            <input type="submit" className="col-6" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPanel;