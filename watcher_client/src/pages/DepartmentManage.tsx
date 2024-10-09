import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import DepartmentManageApi from "../api/DepartmentManageApi.ts";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider.tsx";
import "./DepartmentManage.scss";

const DepartmentManage = (): React.ReactElement => {
    const authHeader = useAuthenticationHeader();
    const [tableList, setTableList] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [currentDepartmentId, setCurrentDepartmentId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await DepartmentManageApi.getAll(authHeader);
                if (response.success) {
                    setTableList(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch departments:", error);
            }
        };
        fetchDepartments().then();
    }, []);

    const handleAddOrUpdateDepartment = async () => {
        try {
            let response;
            if (isEditing && currentDepartmentId) {
                response = await DepartmentManageApi.update(authHeader, currentDepartmentId, departmentName);
            } else {
                response = await DepartmentManageApi.create(authHeader, departmentName);
            }

            if (response.success) {
                const updatedList = isEditing
                    ? tableList.map(item => item.id === currentDepartmentId ? response.data : item)
                    : [...tableList, response.data];
                setTableList(updatedList);
                setShowModal(false);
                setDepartmentName("");
                setIsEditing(false);
                setCurrentDepartmentId(null);
            } else {
                console.error(`Failed to ${isEditing ? "update" : "create"} department:`, response.message);
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? "update" : "create"} department:`, error);
        }
    };

    const handleDeleteDepartment = async () => {
        if (departmentToDelete) {
            try {
                const response = await DepartmentManageApi.delete(authHeader, departmentToDelete);
                if (response.success) {
                    setTableList(tableList.filter((item) => item.id !== departmentToDelete));
                    setShowDeleteModal(false);
                    setDepartmentToDelete(null);
                } else {
                    console.error("Failed to delete department:", response.message);
                }
            } catch (error) {
                console.error("Failed to delete department:", error);
            }
        }
    };

    const handleEditClick = (id: string, name: string) => {
        setCurrentDepartmentId(id);
        setDepartmentName(name);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteClick = (id: string) => {
        setDepartmentToDelete(id);
        setShowDeleteModal(true);
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <>
            <div className={"department-manage-container"}>
                <Button className={"add-button"} variant={"primary"} onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className={"me-2"} />
                    Add...
                </Button>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Create at</th>
                        <th>Update at</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableList.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.departmentName}</td>
                            <td>{formatDate(item.createAt)}</td>
                            <td>{formatDate(item.updateAt)}</td>
                            <td>
                                <Button className={"action-button"} variant={"warning"}
                                        onClick={() => handleEditClick(item.id, item.departmentName)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button className={"action-button"} variant={"danger"} onClick={() => handleDeleteClick(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit" : "Add"} Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId={"departmentName"}>
                            <Form.Label column={"lg"}>Department Name</Form.Label>
                            <Form.Control
                                type={"text"}
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"secondary"} onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant={"primary"} onClick={handleAddOrUpdateDepartment}>
                        {isEditing ? "Update" : "Add"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this department?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"secondary"} onClick={() => setShowDeleteModal(false)}>
                        Close
                    </Button>
                    <Button variant={"danger"} onClick={handleDeleteDepartment}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DepartmentManage;