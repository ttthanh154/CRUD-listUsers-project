import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUsers } from "../services/UserService";
import ReactPaginate from "react-paginate";
import AddUserModal from "./AddUserModal";
import Button from "react-bootstrap/Button";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import "./TableUsers.scss";
import _, { result } from "lodash";
import { debounce } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  //Total Users should be displayed on the screen to know the total of users of database
  const [totalPages, setTotalPages] = useState(0);
  const [isShowAddUserModal, setIsShowAddUserModal] = useState(false);
  const [isShowEditUserModal, setIsShowEditUserModal] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});
  const [isShowDeleteUserModal, setIsShowDeleteUserModal] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});
  //Sort depends on type of sorting and type of field. e.g: Ascending sort and ID (lastname, firstname, email,etc.)
  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("");

  const csvData = [...listUsers];

  //display users first time
  useEffect(() => {
    getUsers(1);
  }, []);

  //display users
  const getUsers = async (page) => {
    let res = await fetchAllUsers(page);
    if (res && res.data) {
      setListUsers(res.data);
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
    }
  };

  //update users after creating new one
  const handleUpdateUsers = (user) => {
    setListUsers([user, ...listUsers]);
  };

  //change page
  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  //close every modal
  const handleClose = () => {
    setIsShowAddUserModal(false);
    setIsShowEditUserModal(false);
    setIsShowDeleteUserModal(false);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowEditUserModal(true);
  };

  //the editUser modal displays data after editing user.
  const handleEditUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    cloneListUser[index].last_name = user.last_name;
    setListUsers(cloneListUser);
  };

  const handleDeleteUser = (user) => {
    setIsShowDeleteUserModal(true);
    setDataUserDelete(user);
  };

  // the deleteUser modal displays data after deleting user
  const handleDeleteUserModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUsers(cloneListUser);
  };

  //Click on asc or desc arrow to sort according to the field
  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUsers(cloneListUser);
  };

  //Type to search for user's email.
  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      setListUsers(cloneListUser);
    } else {
      getUsers(1);
    }
  }, 500);

  const handleImport = (event) => {
    if (event && event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];

      if (file.type !== "text/csv") {
        toast.error("This is not CSV file! ");
        return;
      }

      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong file CSV's header format");
              } else {
                let result = [];

                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
                console.log(result);
              }
            } else {
              toast.error("Wrong format CSV file! ");
            }
          } else {
            toast.error("No data in the file!");
          }
        },
      });
    }
  };

  return (
    <>
      <div>
        <div className="my-3 add-new d-flex justify-content-between">
          <p>List Users:</p>
          <div className="btn-group">
            <Button variant="dark mx-1">
              <label htmlFor="import">
                <i class="fa-solid fa-file-import"></i>
                <span className="mx-2">Import</span>
              </label>
              <input
                id="import"
                type="file"
                hidden
                onChange={(event) => handleImport(event)}
              />
            </Button>

            <Button variant="info mx-1">
              <CSVLink filename={"user-list.csv"} data={csvData}>
                <i class="fa-solid fa-file-arrow-down"></i>
                <span className="mx-2">Export</span>
              </CSVLink>
              <CSVDownload data={csvData} target="_blank" />
            </Button>

            <Button
              variant="success mx-1"
              onClick={() => {
                setIsShowAddUserModal(true);
              }}
            >
              <i class="fa-solid fa-user-plus mx-1"></i>
              Add User
            </Button>
          </div>
        </div>
        <div className="col-3 my-3">
          <input
            className="form-control"
            placeholder="Search for email..."
            // value={keyword}
            onChange={(event) => handleSearch(event)}
          />
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-user">
                  <span>ID</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "id")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "id")}
                    ></i>
                  </span>
                </div>
              </th>

              <th>
                <div className="sort-user">
                  <span>Email</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "email")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "email")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>
                <div className="sort-user">
                  <span>First Name</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "first_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "first_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>
                <div className="sort-user">
                  <span>Last Name</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "last_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "last_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th className="sort-user">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => {
                return (
                  <tr key={`user-${item.id}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <Button
                        variant="warning mx-3"
                        onClick={() => handleEditUser(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteUser(item)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <ReactPaginate
          className="pagination"
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel="< Previous"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="active"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          nextLinkClassName="page-link"
          previousLinkClassName="page-link"
          pageClassName="page-item"
          breakClassName="page-item"
          nextClassName="page-item"
          previousClassName="page-item"
        />
        <AddUserModal
          show={isShowAddUserModal}
          handleClose={handleClose}
          handleUpdateUsers={handleUpdateUsers}
        />
        <EditUserModal
          show={isShowEditUserModal}
          handleClose={handleClose}
          dataUserEdit={dataUserEdit}
          handleEditUserFromModal={handleEditUserFromModal}
        />
        <DeleteUserModal
          show={isShowDeleteUserModal}
          handleClose={setIsShowDeleteUserModal}
          dataUserDelete={dataUserDelete}
          handleDeleteUserModal={handleDeleteUserModal}
        />
      </div>
    </>
  );
};

export default TableUsers;
