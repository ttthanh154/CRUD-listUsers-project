import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import { postCreateUser } from "../services/UserService";
import { toast } from "react-toastify";

const AddUserModal = (props) => {
  const { show, handleClose, handleUpdateUsers } = props;
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleSave = async () => {
    let res = await postCreateUser(email, firstname, lastname);
    console.log(res);
    if (res && res.id && res.firstname && res.lastname) {
      handleClose();
      setEmail("");
      setFirstname("");
      setLastname("");
      toast.success("Add successfully");
      handleUpdateUsers({
        id: res.id,
        email: email,
        first_name: firstname,
        last_name: lastname,
      });
    } else {
      toast.error("Add unsuccessfully");
    }
  };

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
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="body-add-new">
              <div className="mb-3">
                <label nextClassName="form-label">
                  <b>Email</b>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="anonymous@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="none"
                />
              </div>
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
            <Button variant="primary" onClick={() => handleSave()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AddUserModal;
