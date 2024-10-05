import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import DepartmentManageApi from "../api/DepartmentManageApi.tsx";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider.tsx";

const DepartmentManage = (): React.ReactElement => {
    const authHeader = useAuthenticationHeader();
    const [tableList, setTableList] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [currentDepartmentId, setCurrentDepartmentId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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

    const handleEditClick = (id: string, name: string) => {
        setCurrentDepartmentId(id);
        setDepartmentName(name);
        setIsEditing(true);
        setShowModal(true);
    }

    return (
        <>
            <div className={"department-manage-container"}>
                <h1>Departments</h1>
                <Button variant={"primary"} onClick={() => setShowModal(true)}>
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
                            <td>{item.createdAt}</td>
                            <td>{item.updatedAt}</td>
                            <td>
                                <Button variant={"warning"}
                                        onClick={() => handleEditClick(item.id, item.departmentName)}>
                                    <FontAwesomeIcon icon={faEdit} />
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
        </>
    );
}

export default DepartmentManage;