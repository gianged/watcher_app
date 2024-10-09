import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import EnumLoadApi from "../api/EnumLoadApi.ts";
import TicketManageApi from "../api/TicketManageApi";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider";
import "./TicketManage.scss";
import { AuthenticateContext } from "../providers/AuthenticateProvider.tsx";

interface TicketForm {
    appUserId: number;
    content: string;
    status: number;
    isActive: boolean;
}

const TicketManage = (): React.ReactElement => {
    const authHeader = useAuthenticationHeader();
    const {user} = useContext(AuthenticateContext);
    const [ticketList, setTicketList] = useState<any[]>([]);
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState<number | null>(null);
    const [ticketForm, setTicketForm] = useState<TicketForm>({
        appUserId: user?.id || 0,
        content: "",
        status: 0,
        isActive: false
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);
    const [ticketStatuses, setTicketStatuses] = useState<any[]>([]);

    const rightPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await TicketManageApi.getAll(authHeader);
                if (response.success) {
                    setTicketList(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            }
        };

        const fetchTicketStatuses = async () => {
            try {
                const response = await EnumLoadApi.getTicketStatus();
                if (response.success) {
                    setTicketStatuses(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch ticket statuses:", error);
            }
        };

        fetchTickets().then();
        fetchTicketStatuses().then();
    }, []);

    const handleAddClick = () => {
        setIsEditing(false);
        setTicketForm({
            appUserId: user?.id || 0,
            content: "",
            status: 0,
            isActive: false
        });
        setShowRightPanel(true);
    };

    const handleEditClick = (id: number, ticket: any) => {
        setCurrentTicketId(id);
        setTicketForm({...ticket, appUserId: user?.id || 0});
        setIsEditing(true);
        setShowRightPanel(true);
    };

    const handleDeleteClick = (id: number) => {
        setTicketToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteTicket = async () => {
        if (ticketToDelete) {
            try {
                const response = await TicketManageApi.delete(authHeader, ticketToDelete);
                if (response.success) {
                    setTicketList(ticketList.filter(ticket => ticket.id !== ticketToDelete));
                } else {
                    console.error("Failed to delete ticket:", response.message);
                }
            } catch (error) {
                console.error("Failed to delete ticket:", error);
            } finally {
                setShowDeleteModal(false);
                setTicketToDelete(null);
            }
        }
    };

    const handleAddOrUpdate = async () => {
        try {
            let response;
            if (isEditing && currentTicketId) {
                response = await TicketManageApi.update(authHeader, currentTicketId, {
                    ...ticketForm,
                    appUserId: user?.id || 0,
                    status: ticketForm.status
                });
            } else {
                response = await TicketManageApi.create(authHeader, {
                    ...ticketForm,
                    appUserId: user?.id || 0,
                    status: ticketForm.status
                });
            }

            if (response.success) {
                const updatedList = isEditing
                    ? ticketList.map(ticket => ticket.id === currentTicketId ? response.data : ticket)
                    : [...ticketList, response.data];
                setTicketList(updatedList);
                setShowRightPanel(false);
                setTicketForm({
                    appUserId: user?.id || 0,
                    content: "",
                    status: 0,
                    isActive: false
                });
                setIsEditing(false);
                setCurrentTicketId(null);
            } else {
                console.error(`Failed to ${isEditing ? "update" : "create"} ticket:`, response.message);
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? "update" : "create"} ticket:`, error);
        }
    };

    return (
        <div className="ticket-manage-container">
            <Button className={"add-button"} onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className={"me-2"} />
                Add...
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {ticketList.map(ticket => (
                    <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.content}</td>
                        <td>{ticket.status}</td>
                        <td>
                            <Button className={"action-button"} variant="warning"
                                    onClick={() => handleEditClick(ticket.id, ticket)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button className={"action-button"} variant="danger"
                                    onClick={() => handleDeleteClick(ticket.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this ticket?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteTicket}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {showRightPanel && (
                <div className="backdrop" onClick={() => setShowRightPanel(false)}>
                    <div className="right-panel" ref={rightPanelRef} onClick={e => e.stopPropagation()}>
                        <Form>
                            <Form.Group controlId={"ticketContent"}>
                                <Form.Label column={"sm"}>Content</Form.Label>
                                <Form.Control
                                    as={"textarea"}
                                    rows={3}
                                    value={ticketForm.content}
                                    onChange={(e) => setTicketForm({...ticketForm, content: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group controlId={"ticketStatus"}>
                                <Form.Label column={"sm"}>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={ticketForm.status}
                                    onChange={event => {
                                        const selectedStatusId = parseInt(event.target.value);
                                        setTicketForm({
                                            ...ticketForm,
                                            status: selectedStatusId
                                        });
                                    }}
                                >
                                    {ticketStatuses.map(status => (
                                        <option key={status.id} value={status.id}>{status.statusName}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId={"ticketIsActive"} className={"checkbox-group"}>
                                <Form.Check
                                    type="checkbox"
                                    label="Is Active"
                                    checked={ticketForm.isActive}
                                    onChange={(e) => setTicketForm({...ticketForm, isActive: e.target.checked})}
                                />
                            </Form.Group>
                            <div className={"button-row"}>
                                <Button onClick={handleAddOrUpdate}
                                        className={"button-col"}>{isEditing ? "Update" : "Add"}</Button>
                            </div>

                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketManage;