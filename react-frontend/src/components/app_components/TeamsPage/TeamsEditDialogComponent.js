import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const TeamsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [projectID, setProjectID] = useState([])
const [userID, setUserID] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount projects
                    client
                        .service("projects")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleProjectsId } })
                        .then((res) => {
                            setProjectID(res.data.map((e) => { return { name: e['projectID'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Projects", type: "error", message: error.message || "Failed get projects" });
                        });
                }, []);
 useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setUserID(res.data.map((e) => { return { name: e['userID'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            teamID: _entity?.teamID,
projectID: _entity?.projectID?._id,
userID: _entity?.userID?._id,
teamName: _entity?.teamName,
        };

        setLoading(true);
        try {
            
        await client.service("teams").patch(_entity._id, _data);
        const eagerResult = await client
            .service("teams")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "projectID",
                    service : "projects",
                    select:["projectID"]},{
                    path : "userID",
                    service : "users",
                    select:["userID"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info teams updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const projectIDOptions = projectID.map((elem) => ({ name: elem.name, value: elem.value }));
const userIDOptions = userID.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Teams" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="teams-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="teamID">Team ID:</label>
                <InputText id="teamID" className="w-full mb-3 p-inputtext-sm" value={_entity?.teamID} onChange={(e) => setValByKey("teamID", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["teamID"]) && (
              <p className="m-0" key="error-teamID">
                {error["teamID"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectID">Project ID:</label>
                <Dropdown id="projectID" value={_entity?.projectID?._id} optionLabel="name" optionValue="value" options={projectIDOptions} onChange={(e) => setValByKey("projectID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["projectID"]) && (
              <p className="m-0" key="error-projectID">
                {error["projectID"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userID">User ID:</label>
                <Dropdown id="userID" value={_entity?.userID?._id} optionLabel="name" optionValue="value" options={userIDOptions} onChange={(e) => setValByKey("userID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userID"]) && (
              <p className="m-0" key="error-userID">
                {error["userID"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="teamName">Team Name:</label>
                <InputText id="teamName" className="w-full mb-3 p-inputtext-sm" value={_entity?.teamName} onChange={(e) => setValByKey("teamName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["teamName"]) && (
              <p className="m-0" key="error-teamName">
                {error["teamName"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(TeamsCreateDialogComponent);
