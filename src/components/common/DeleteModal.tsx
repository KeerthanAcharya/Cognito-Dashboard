import React from "react";
import {Modal,Col,Button} from 'react-bootstrap';

import WarningIcon from "../../assets/icons/warning.svg";
import DeleteIcon from "../../assets/icons/deleteWhite.svg";
import CancelIcon from "../../assets/icons/cancel.svg";

interface Props{
    show:boolean,
    setShow:any,
    category:string,
    onDelete?:any
}

const DeleteModal = ({show,setShow,category,onDelete}:Props) => {

    const handleCloser=()=>{
        setShow(false)
    }
  return (
    <Modal show={show} onHide={handleCloser} centered>
      <Modal.Header closeButton>
        <Modal.Title
          className="d-flex"
          style={{ width: "100vw", height: "6vh" }}
        >
          <Col md={2}>
            <img
              src={WarningIcon}
              alt="warningIcon"
              height="30px"
              style={{ marginTop: "2%" }}
            />
          </Col>
          <Col className="p-0" style={{ marginLeft: "-2rem" }}>
            <div className="p-0 d-flex" style={{ marginTop: "0.5rem" }}>
              <h4
                data-testid="taskdeletesendmail_text"
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Delete {category}
              </h4>
              {/* <h4
                data-testid="taskdeletesendmail_text"
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                className="hide-text-modal"
              >
                {category}
              </h4> */}
            </div>
          </Col>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p data-testid="popup_text" style={{ fontSize: "14px" }}>
          Are you sure you want to delete the task.This would delete all data
          related to the task ,this cannot be reversed.{" "}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            data-testid="deletetask_text"
            variant="danger"
            style={{ margin: "2%", fontSize: "14px" }}
            onClick={onDelete}
          >
            <img
              src={DeleteIcon}
              alt="DeleteIcon"
              style={{
                color: "white",
                position: "relative",
                right: "6%",
                marginTop: "-2%",
              }}
            />
            Delete Task
          </Button>
          <Button
            data-testid="cancel_text"
            style={{
              margin: "2%",
              backgroundColor: "#E5E5E5",
              color: "#30346B",
              fontSize: "14px",
            }}
            onClick={handleCloser}
          >
            <img
              src={CancelIcon}
              alt="DeleteIcon"
              style={{
                color: "white",
                position: "relative",
                right: "8%",
                marginTop: "-3%",
              }}
              width="10px"
            />
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};


export default DeleteModal;
