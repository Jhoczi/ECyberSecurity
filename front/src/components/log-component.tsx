import React, {useEffect} from "react";
import AuthService from "../services/auth.service";
import ILog from "../types/log-type";

export const LogBoard = () => {

    const [logs, setLogs] = React.useState<ILog[]>([]);

    useEffect(() => {
        const logs = AuthService.getLogs()
            .then(response => {
                let logs = response;
                setLogs(logs);
            });
    }, []);

    return (
        <div className="col-12">
            <h1>Log Panel</h1>
            <div className="">
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>Action</th>
                        {/*<th>Description</th>*/}
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs && logs.map(log =>
                        <tr key={log.id}>
                            {/*<td>{log.action}</td>*/}
                            <td>{log.description}</td>
                            <td>{log.createdAt.toString()}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>


    );
};