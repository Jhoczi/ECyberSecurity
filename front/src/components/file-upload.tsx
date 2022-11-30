import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useState} from "react";
import AuthService from "../services/auth.service";

type State = {
    loading: boolean,
    message: string,
    redirect: string | null,
    file: File | string,
}

export const FileUploadPage = () => {

    const [state, setState] = useState<State>({
        loading: false,
        message: "",
        redirect: null,
        file: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFile = (formValue: {file: File | string}) => {

        setState({
            ...state, // xD?
            message: "",
            loading: true,
        });

        console.log("xd");
        const {file} = formValue;
        console.log(file);
        console.log(selectedFile);

        AuthService.uploadFile(selectedFile).then(() => {
            console.log("File uploaded!");
        },
            (error) => {
                console.log(error);
                setState({
                    ...state,
                    loading: false,
                    message: error});
            });
    }

    const {loading, message } = state;
    const initialValues = {
        file: "",
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <h2>Upload a file</h2>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleFile}
                >
                    <Form>

                        <div className="form-group mt2">
                            <label htmlFor="file">File</label>
                            <input type="file" className="form-control" onChange={(event: any)=>{
                                setSelectedFile(event.target.files[0]);
                            }}/>
                        </div>

                        <div className="form-group mt-2">
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Upload File</span>
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