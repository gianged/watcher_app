import { faAngleLeft, faAngleRight, faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./UserManage.scss"
import { Button, Form, Modal, Table } from "react-bootstrap";
import DepartmentManageApi from "../api/DepartmentManageApi.ts";
import EnumLoadApi from "../api/EnumLoadApi.ts";
import UserManageApi from "../api/UserManageApi.ts";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider.tsx";
import { AuthenticateContext } from "../providers/AuthenticateProvider.tsx";

interface UserForm {
    username: string,
    password: string,
    departmentId: string | null,
    roleLevel: number,
    isActive: boolean
}

export const UserManage = (): React.ReactElement => {
    const authHeader = useAuthenticationHeader();
    const {user} = useContext(AuthenticateContext);
    const [userList, setUserList] = useState<any[]>([]);
    const [roleLevels, setRoleLevels] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userForm, setUserForm] = useState<UserForm>({
        username: "",
        password: "",
        departmentId: null,
        roleLevel: 4,
        isActive: false
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const rightPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPagedUsers(page, size).then();
        fetchRoles().then();
        fetchDepartments().then();
    }, [showRightPanel, showDeleteModal, page]);

    const fetchPagedUsers = async (page: number, size: number) => {
        try {
            const response = await UserManageApi.getPaged(authHeader, page, size);
            if (response.success) {
                setUserList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error("Failed to fetch paged users:", response.message);
            }
        } catch (error) {
            console.error("Failed to fetch paged users:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await EnumLoadApi.getRoles();
            if (response.success) {
                setRoleLevels(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await DepartmentManageApi.getAll(authHeader);
            if (response.success) {
                setDepartments(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch departments:", error);
        }
    };

    const handleAddOrUpdate = async () => {
        try {
            let userFormToSubmit = {...userForm};

            if (user?.roleLevel === 3) {
                userFormToSubmit.departmentId = user?.departmentId?.toString();
            }

            let response;
            if (isEditing && currentUserId) {
                response = await UserManageApi.update(authHeader, currentUserId, userForm);
            } else {
                response = await UserManageApi.create(authHeader, userForm);
            }

            if (response.success) {
                const updatedList = isEditing
                    ? userList.map(user => user.id === currentUserId ? response.data : user) :
                    [...userList, response.data];
                setUserList(updatedList);
                setShowRightPanel(false);
                setUserForm({
                    username: "",
                    password: "",
                    departmentId: user?.roleLevel === 3 ? user?.departmentId.toString() : null,
                    roleLevel: 4,
                    isActive: false
                });
                setIsEditing(false);
                setCurrentUserId(null);
            } else {
                console.error(`Failed to ${isEditing ? "update" : "create"} user:`, response.message);
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? "update" : "create"} user:`, error);
        }
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setUserForm({
            username: "",
            password: "",
            departmentId: user?.roleLevel === 3 ? user?.departmentId.toString() : null,
            roleLevel: 4,
            isActive: false
        });
        setShowRightPanel(true);
    }

    const handleEditClick = (id: string, user: any) => {
        setCurrentUserId(id);
        setUserForm(user);
        setIsEditing(true);
        setShowRightPanel(true);
    };

    const handleDeleteClick = async (id: string) => {
        setUserToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        if (userToDelete) {
            try {
                const response = await UserManageApi.delete(authHeader, userToDelete);
                if (response.success) {
                    setUserList(userList.filter(user => user.id !== userToDelete));
                } else {
                    console.error("Failed to delete user:", response.message);
                }
            } catch (error) {
                console.error("Failed to delete user:", error);
            } finally {
                setShowDeleteModal(false);
                setUserToDelete(null);
            }
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (rightPanelRef.current && !rightPanelRef.current.contains(event.target as Node)) {
            setShowRightPanel(false);
        }
    };

    useEffect(() => {
        if (showRightPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRightPanel]);

    const getDepartmentNameById = (id: number) => {
        const department = departments.find(dept => dept.id === id);
        return department ? department.departmentName : 'Unknown';
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <>
            <div className="user-manage-container">
                <Button className={"add-button"} onClick={handleAddClick}>
                    <FontAwesomeIcon icon={faPlus} className={"me-2"} />
                    Add...
                </Button>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList.map(u => (
                        <tr key={u.id}>
                            <td>{u.username}</td>
                            <td>{getDepartmentNameById(u.departmentId)}</td>
                            <td>{roleLevels.find(role => role.id === u.roleLevel)?.roleName}</td>
                            <td>{u.isActive ? "Active" : "Inactive"}</td>
                            <td>
                                {u.id !== user?.id && (
                                    <>
                                        <Button
                                            className="action-button" variant={"warning"}
                                            onClick={() => handleEditClick(u.id, u)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            className="action-button" variant={"danger"}
                                            onClick={() => handleDeleteClick(u.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <div className="pagination-controls">
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </Button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                </div>

                {showRightPanel && (
                    <div className="backdrop">
                        <div className="right-panel shadow-lg p-3 mb-5 bg-white rounded" ref={rightPanelRef}>
                            <h2>{isEditing ? "Edit User" : "Add User"}</h2>
                            <Form onSubmit={async (e) => {
                                e.preventDefault();
                                await handleAddOrUpdate();
                            }}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label column={"sm"}>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.username}
                                        onChange={e => setUserForm({...userForm, username: e.target.value})}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label column={"sm"}>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={userForm.password}
                                        onChange={e => setUserForm({...userForm, password: e.target.value})}
                                    />
                                </Form.Group>
                                {user?.roleLevel !== 3 && (
                                    <Form.Group controlId="formDepartment">
                                        <Form.Label column={"sm"}>Department</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={userForm.departmentId || ""}
                                            onChange={(e) =>
                                                setUserForm({...userForm, departmentId: e.target.value})
                                            }
                                        >
                                            <option value="">Select a Department</option>
                                            {departments.map((department) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.departmentName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                )}
                                {user?.roleLevel !== 3 && (
                                    <Form.Group controlId="formRole">
                                        <Form.Label column={"sm"}>Role</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={userForm.roleLevel}
                                            onChange={e => setUserForm({
                                                ...userForm,
                                                roleLevel: parseInt(e.target.value)
                                            })}
                                        >
                                            {roleLevels.map(role => (
                                                <option key={role.id} value={role.id}>{role.roleName}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                )}
                                <Form.Group controlId="formStatus" className={"checkbox-group"}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Active"
                                        checked={userForm.isActive}
                                        onChange={e => setUserForm({...userForm, isActive: e.target.checked})}
                                    />
                                </Form.Group>
                                < div className={"button-row"}>
                                    <Button type="submit" variant="primary" className={"button-col"}>
                                        {isEditing ? "Update" : "Add"}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                )
                }

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteUser}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
        ;
}