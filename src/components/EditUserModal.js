import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { useEffect, useState } from "react";
import { putEditUser } from "../services/UserService";
import { toast } from "react-toastify";
import { last } from "lodash";

const EditUserModal = (props) => {
  const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleEditUser = async () => {
    let res = await putEditUser(dataUserEdit.id, firstname, lastname);
    console.log(res);
    if (res && res.updatedAt) {
      handleEditUserFromModal({
        id: dataUserEdit.id,
        first_name: firstname,
        last_name: lastname,
      });
      handleClose();
      setFirstname("");
      setLastname("");
      toast.success("Edit successfully");
    }
  };

  useEffect(() => {
    if (show) {
      setFirstname(dataUserEdit.first_name);
      setLastname(dataUserEdit.last_name);
    }
  }, [dataUserEdit]);

  return (
    <>
      <div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="body-add-new">
              <div className="mb-3">
                <label nextClassName="form-label">
                  <b>First Name:</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Andy"
                  value={firstname}
                  onChange={(event) => setFirstname(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <b>Last Name:</b>
                </label>
                <textarea
                  className="form-control"
                  placeholder="William"
                  value={lastname}
                  onChange={(event) => setLastname(event.target.value)}
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleEditUser()}>
              Finish
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EditUserModal;
