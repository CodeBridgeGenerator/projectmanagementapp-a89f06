import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const TeamsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [projectID, setProjectID] = useState([])
const [userID, setUserID] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [projectID,userID], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.teamID)) {
                error["teamID"] = `Team ID field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.teamName)) {
                error["teamName"] = `Team Name field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            teamID: _entity?.teamID,projectID: _entity?.projectID?._id,userID: _entity?.userID?._id,teamName: _entity?.teamName,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("teams").create(_data);
        const eagerResult = await client
            .service("teams")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "projectID",
                    service : "projects",
                    select:["projectID"]},{
                    path : "userID",
                    service : "users",
                    select:["userID"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Teams updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Teams" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount projects
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
                    // on mount users
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
        <Dialog header="Create Teams" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="teams-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="teamID">Team ID:</label>
                <InputText id="teamID" className="w-full mb-3 p-inputtext-sm" value={_entity?.teamID} onChange={(e) => setValByKey("teamID", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["teamID"]) ? (
              <p className="m-0" key="error-teamID">
                {error["teamID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectID">Project ID:</label>
                <Dropdown id="projectID" value={_entity?.projectID?._id} optionLabel="name" optionValue="value" options={projectIDOptions} onChange={(e) => setValByKey("projectID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["projectID"]) ? (
              <p className="m-0" key="error-projectID">
                {error["projectID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userID">User ID:</label>
                <Dropdown id="userID" value={_entity?.userID?._id} optionLabel="name" optionValue="value" options={userIDOptions} onChange={(e) => setValByKey("userID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userID"]) ? (
              <p className="m-0" key="error-userID">
                {error["userID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="teamName">Team Name:</label>
                <InputText id="teamName" className="w-full mb-3 p-inputtext-sm" value={_entity?.teamName} onChange={(e) => setValByKey("teamName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["teamName"]) ? (
              <p className="m-0" key="error-teamName">
                {error["teamName"]}
              </p>
            ) : null}
          </small>
            </div>
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
