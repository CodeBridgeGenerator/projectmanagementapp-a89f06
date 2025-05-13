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
import { Calendar } from "primereact/calendar";
import UploadFilesToS3 from "../../../services/UploadFilesToS3";


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

const TasksCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [userID, setUserID] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [userID], setError);
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
  
            if (_.isEmpty(_entity?.taskTitle)) {
                error["taskTitle"] = `Task Title field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.description)) {
                error["description"] = `Description field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.status)) {
                error["status"] = `Status field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.priority)) {
                error["priority"] = `Priority field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.attachments)) {
                error["attachments"] = `Attachments field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            projectID: _entity?.projectID,userID: _entity?.userID?._id,taskTitle: _entity?.taskTitle,description: _entity?.description,startDate: _entity?.startDate,dueDate: _entity?.dueDate,status: _entity?.status,priority: _entity?.priority,attachments: _entity?.attachments,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("tasks").create(_data);
        const eagerResult = await client
            .service("tasks")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "userID",
                    service : "users",
                    select:["userID"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Tasks updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Tasks" });
        }
        setLoading(false);
    };

    const onFileLoaded = (file, status) => {
    if (status)
      props.alert({
        title: "file uploader",
        type: "success",
        message: "file uploaded" + file.name
      });
    else
      props.alert({
        title: "file uploader",
        type: "error",
        message: "file uploader failed" + file.name
      });
  };

    const setId = (id) => { setValByKey("attachments", id);  };

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

    const userIDOptions = userID.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Tasks" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="tasks-create-dialog-component">
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
                <label htmlFor="taskTitle">Task Title:</label>
                <InputText id="taskTitle" className="w-full mb-3 p-inputtext-sm" value={_entity?.taskTitle} onChange={(e) => setValByKey("taskTitle", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["taskTitle"]) ? (
              <p className="m-0" key="error-taskTitle">
                {error["taskTitle"]}
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
                <Calendar id="startDate"  value={_entity?.startDate ? new Date(_entity?.startDate) : null} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("startDate", new Date(e.target.value))} showIcon showButtonBar  />
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
                <label htmlFor="dueDate">Due Date:</label>
                <Calendar id="dueDate"  value={_entity?.dueDate ? new Date(_entity?.dueDate) : null} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("dueDate", new Date(e.target.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["dueDate"]) ? (
              <p className="m-0" key="error-dueDate">
                {error["dueDate"]}
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
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="priority">Priority:</label>
                <InputText id="priority" className="w-full mb-3 p-inputtext-sm" value={_entity?.priority} onChange={(e) => setValByKey("priority", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["priority"]) ? (
              <p className="m-0" key="error-priority">
                {error["priority"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="attachments">Attachments:</label>
                    <UploadFilesToS3 type={'create'} user={props.user} id={urlParams.id} serviceName="tasks" onUploadComplete={setId} onFileLoaded={onFileLoaded}/>
                </span>
                <small className="p-error">
                {!_.isEmpty(error["attachments"]) ? (
                  <p className="m-0" key="error-attachments">
                    {error["attachments"]}
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

export default connect(mapState, mapDispatch)(TasksCreateDialogComponent);
