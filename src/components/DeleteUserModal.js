import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";
const DeleteUserModal = (props) => {
  const { show, handleClose, dataUserDelete, handleDeleteUserModal } = props;

  const handleDelete = async () => {
    let res = await deleteUser(dataUserDelete.id);
    if (res && +res.statusCode === 204) {
      toast.success("Delete user successfully!");
      handleClose();
      handleDeleteUserModal(dataUserDelete);
    } else {
      toast.error("Error!");
    }
    console.log("check res: ", res);
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
              Are you sure to delete this user (email: {dataUserDelete.email})?
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default DeleteUserModal;
