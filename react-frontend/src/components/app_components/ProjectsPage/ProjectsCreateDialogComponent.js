import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";


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

const ProjectsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.projectID)) {
                error["projectID"] = `Project ID field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.clientID)) {
                error["clientID"] = `Client ID field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.projectTitle)) {
                error["projectTitle"] = `Project Title field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.description)) {
                error["description"] = `Description field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.startDate)) {
                error["startDate"] = `Start Date field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.endDate)) {
                error["endDate"] = `End Date field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.status)) {
                error["status"] = `Status field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            projectID: _entity?.projectID,clientID: _entity?.clientID,projectTitle: _entity?.projectTitle,description: _entity?.description,startDate: _entity?.startDate,endDate: _entity?.endDate,status: _entity?.status,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("projects").create(_data);
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Projects created successfully" });
        props.onCreateResult(result);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Projects" });
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

    

    return (
        <Dialog header="Create Projects" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="projects-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectID">Project ID:</label>
                <InputText id="projectID" className="w-full mb-3 p-inputtext-sm" value={_entity?.projectID} onChange={(e) => setValByKey("projectID", e.target.value)}  required  />
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
                <label htmlFor="clientID">Client ID:</label>
                <InputText id="clientID" className="w-full mb-3 p-inputtext-sm" value={_entity?.clientID} onChange={(e) => setValByKey("clientID", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["clientID"]) ? (
              <p className="m-0" key="error-clientID">
                {error["clientID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectTitle">Project Title:</label>
                <InputText id="projectTitle" className="w-full mb-3 p-inputtext-sm" value={_entity?.projectTitle} onChange={(e) => setValByKey("projectTitle", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["projectTitle"]) ? (
              <p className="m-0" key="error-projectTitle">
                {error["projectTitle"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="description">Description:</label>
                <InputText id="description" className="w-full mb-3 p-inputtext-sm" value={_entity?.description} onChange={(e) => setValByKey("description", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["description"]) ? (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="startDate">Start Date:</label>
                <InputText id="startDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.startDate} onChange={(e) => setValByKey("startDate", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["startDate"]) ? (
              <p className="m-0" key="error-startDate">
                {error["startDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="endDate">End Date:</label>
                <InputText id="endDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.endDate} onChange={(e) => setValByKey("endDate", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["endDate"]) ? (
              <p className="m-0" key="error-endDate">
                {error["endDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="status">Status:</label>
                <InputText id="status" className="w-full mb-3 p-inputtext-sm" value={_entity?.status} onChange={(e) => setValByKey("status", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["status"]) ? (
              <p className="m-0" key="error-status">
                {error["status"]}
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

export default connect(mapState, mapDispatch)(ProjectsCreateDialogComponent);
