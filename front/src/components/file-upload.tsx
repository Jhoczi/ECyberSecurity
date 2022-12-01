import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useState} from "react";
import AuthService from "../services/auth.service";

type State = {
    loading: boolean,
    message: string,
    redirect: string | null,
    file: File | string,
    txtContent: string,
    showMsg: boolean,
}

export const FileUploadPage = () => {

    const [state, setState] = useState<State>({
        loading: false,
        message: "",
        redirect: null,
        file: "",
        txtContent: "",
        showMsg: false,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFile = (formValue: {accessKey: string}) => {

        const {accessKey} = formValue;
        setState({
            ...state,
            message: "",
            showMsg: false,
            loading: true,
        });

        console.log(selectedFile);

        if (selectedFile === null)
            return;

        if (selectedFile.type !== "text/plain") {

            console.log("Request to Damian");
            AuthService.checkAccessKey(accessKey).then(
                (data: boolean) => {
                    console.log("Damian result: " + data);
                    if (data)
                    {
                        readSingleFile(selectedFile);
                    }
                    else
                        setState({
                            ...state,
                            loading: false,
                            showMsg: true,
                            txtContent: "",
                        });
                        alert("Your program version does not support this file type.");
                },
                (error) => {
                    // //const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    // setState({
                    //     ...state,
                    //     loading: false,
                    //     txtContent: "",
                    //     message: resMessage,
                    // });
                });
        }
        else
        {
            console.log("File is txt");
            readSingleFile(selectedFile);
        }

    };

    const readSingleFile = (e: File | null) => {
        const file = e;
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target?.result;
            console.log(contents);

            setState({
                ...state,
                txtContent: contents as string,
            });
        };
        reader.readAsText(file);
    };

    const {loading, message, showMsg } = state;
    const initialValues = {
        file: "",
        accessKey: "",
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

                        <div className="form-group mt-2">
                            <label htmlFor="file">Insert here access key <br/>(Not required for txt)</label>
                            <Field name="accessKey" type="password" className="form-control" />
                            {/*<ErrorMessage */}
                            {/*    name="accessKey"*/}
                            {/*    component="div"*/}
                            {/*    className="alert alert-danger"*/}
                            {/*/>*/}
                            {message}
                        </div>

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

                        {/*{showMsg && (*/}
                        {/*    <div className="form-group">*/}
                        {/*        <div className="alert alert-danger" role="alert">*/}
                        {/*            {message}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </Form>
                </Formik>
            </div>
            Tekst: {state.txtContent}
        </div>
    );
}
