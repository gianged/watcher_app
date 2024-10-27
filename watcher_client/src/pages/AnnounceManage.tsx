import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import AnnounceManageApi from "../api/AnnounceManageApi";
import DepartmentManageApi from "../api/DepartmentManageApi";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider";
import "./AnnounceManage.scss";

interface AnnounceForm {
    content: string;
    startDate: string;
    endDate: string;
    departmentId: number | null;
    isPublic: boolean;
    isActive: boolean;
}

const AnnounceManage = (): React.ReactElement => {
    const authHeader = useAuthenticationHeader();
    const [announceList, setAnnounceList] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAnnounceId, setCurrentAnnounceId] = useState<string | null>(null);
    const [announceForm, setAnnounceForm] = useState<AnnounceForm>({
        content: "",
        startDate: "",
        endDate: "",
        departmentId: null,
        isPublic: false,
        isActive: false
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [announceToDelete, setAnnounceToDelete] = useState<any | null>(null);

    const rightPanelRef = useRef<HTMLDivElement>(null);

    // Fetch announcements and departments on component mount
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await AnnounceManageApi.getAll(authHeader);
                if (response.success) {
                    setAnnounceList(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
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

        fetchAnnouncements().then();
        fetchDepartments().then();
    }, [showRightPanel, showDeleteModal]);

    const handleAddClick = () => {
        setIsEditing(false);
        setAnnounceForm({
            content: "",
            startDate: "",
            endDate: "",
            departmentId: null,
            isPublic: false,
            isActive: false
        });
        setShowRightPanel(true);
    };

    const handleEditClick = (id: string, announce: any) => {
        const adjustToLocalDate = (dateString: string) => {
            const date = new Date(dateString);
            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
            return date.toISOString().split('T')[0];
        };

        setCurrentAnnounceId(id);
        setAnnounceForm({
            ...announce,
            startDate: adjustToLocalDate(announce.startDate),
            endDate: adjustToLocalDate(announce.endDate)
        });
        setIsEditing(true);
        setShowRightPanel(true);
    };

    const handleDeleteClick = (id: string) => {
        setAnnounceToDelete(id);
        setShowDeleteModal(true);
    };

    const handleAddOrUpdate = async () => {
        try {
            let response;

            const startDate = new Date(announceForm.startDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(announceForm.endDate);
            endDate.setHours(0, 0, 0, 0);

            const formWithAdjustedDates = {
                ...announceForm,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            };

            if (isEditing && currentAnnounceId) {
                response = await AnnounceManageApi.update(authHeader, currentAnnounceId, formWithAdjustedDates);
            } else {
                response = await AnnounceManageApi.create(authHeader, formWithAdjustedDates);
            }

            if (response.success) {
                const updatedList = isEditing
                    ? announceList.map(announce => announce.id === currentAnnounceId ? response.data : announce)
                    : [...announceList, response.data];
                setAnnounceList(updatedList);
                setShowRightPanel(false);
                setAnnounceForm({
                    content: "",
                    startDate: "",
                    endDate: "",
                    departmentId: null,
                    isPublic: false,
                    isActive: false
                });
                setIsEditing(false);
                setCurrentAnnounceId(null);
            } else {
                console.error(`Failed to ${isEditing ? "update" : "create"} announcement:`, response.message);
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? "update" : "create"} announcement:`, error);
        }
    };

    const confirmDeleteAnnouncement = async () => {
        if (announceToDelete) {
            try {
                const response = await AnnounceManageApi.delete(authHeader, announceToDelete);
                if (response.success) {
                    setAnnounceList(announceList.filter(announce => announce.id !== announceToDelete));
                } else {
                    console.error("Failed to delete announcement:", response.message);
                }
            } catch (error) {
                console.error("Failed to delete announcement:", error);
            } finally {
                setShowDeleteModal(false);
                setAnnounceToDelete(null);
            }
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (rightPanelRef.current && !rightPanelRef.current.contains(event.target as Node)) {
            setShowRightPanel(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getDepartmentNameById = (id: number) => {
        const department = departments.find(dept => dept.id === id);
        return department ? department.departmentName : 'Unknown';
    };

    return (
        <>
            <div className="announce-manage-container">
                <Button className={"add-button"} onClick={handleAddClick}>
                    <FontAwesomeIcon icon={faPlus} className={"me-2"} />
                    Add...
                </Button>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Content</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Department ID</th>
                        <th>Public</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {announceList.map(announce => (
                        <tr key={announce.id}>
                            <td>{announce.content}</td>
                            <td>{new Date(announce.startDate).toLocaleDateString()}</td>
                            <td>{new Date(announce.endDate).toLocaleDateString()}</td>
                            <td>{announce.isPublic ? "Public" : getDepartmentNameById(announce.departmentId)}</td>
                            <td>{announce.isPublic ? "Yes" : "No"}</td>
                            <td>{announce.isActive ? "Yes" : "No"}</td>
                            <td>
                                <Button className={"action-button"} variant={"warning"}
                                        onClick={() => handleEditClick(announce.id, announce)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button className={"action-button"} variant={"danger"}
                                        onClick={() => handleDeleteClick(announce.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {showRightPanel && (
                    <div className="backdrop">
                        <div className="right-panel" ref={rightPanelRef}>
                            <Form>
                                <Form.Group controlId="formContent">
                                    <Form.Label column={"sm"}>Content</Form.Label>
                                    <Form.Control
                                        as={"textarea"}
                                        rows={3}
                                        placeholder="Enter content"
                                        value={announceForm.content}
                                        onChange={e => setAnnounceForm({...announceForm, content: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formStartDate">
                                    <Form.Label column={"sm"}>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={announceForm.startDate}
                                        onChange={e => {
                                            const newStartDate = e.target.value;
                                            let newEndDate = announceForm.endDate;
                                            if (new Date(newEndDate) < new Date(newStartDate)) {
                                                const adjustedEndDate = new Date(newStartDate);
                                                adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
                                                newEndDate = adjustedEndDate.toISOString().split('T')[0];
                                            }
                                            setAnnounceForm({...announceForm, startDate: newStartDate, endDate: newEndDate});
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEndDate">
                                    <Form.Label column={"sm"}>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={announceForm.endDate}
                                        onChange={e => {
                                            const newEndDate = e.target.value;
                                            let newStartDate = announceForm.startDate;
                                            if (new Date(newEndDate) < new Date(newStartDate)) {
                                                const adjustedStartDate = new Date(newEndDate);
                                                adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);
                                                newStartDate = adjustedStartDate.toISOString().split('T')[0];
                                            }
                                            setAnnounceForm({...announceForm, endDate: newEndDate, startDate: newStartDate});
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formDepartmentId">
                                    <Form.Label column={"sm"}>Department</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={announceForm.departmentId ?? ""}
                                        onChange={e => setAnnounceForm({
                                            ...announceForm,
                                            departmentId: e.target.value ? Number(e.target.value) : null
                                        })}
                                        disabled={announceForm.isPublic}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(department => (
                                            <option key={department.id} value={department.id}>
                                                {department.departmentName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="formIsPublic" className={"checkbox-group"}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Is Public"
                                        checked={announceForm.isPublic}
                                        onChange={e => setAnnounceForm({
                                            ...announceForm,
                                            isPublic: e.target.checked,
                                            departmentId: null
                                        })}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formIsActive" className={"checkbox-group"}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Is Active"
                                        checked={announceForm.isActive}
                                        onChange={e => setAnnounceForm({...announceForm, isActive: e.target.checked})}
                                    />
                                </Form.Group>

                                <div className={"button-row"}>
                                    <Button variant="primary" className={"button-col"} onClick={handleAddOrUpdate}>
                                        {isEditing ? "Update" : "Add"} Announcement
                                    </Button>
                                </div>

                            </Form>
                        </div>
                    </div>
                )}

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this announcement?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={confirmDeleteAnnouncement}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default AnnounceManage;