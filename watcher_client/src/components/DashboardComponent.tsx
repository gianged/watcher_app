import { faExclamationCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import AnnounceManageApi from "../api/AnnounceManageApi";
import EnumLoadApi from "../api/EnumLoadApi.ts";
import TicketManageApi from "../api/TicketManageApi.ts";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider.tsx";
import "./DashbroadComponent.scss";

interface DashboardProps {
    role: number,
    department: number,
    userId: number
}

export const DashboardComponent: React.FC<DashboardProps> = ({role, department}) => {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newTicketContent, setNewTicketContent] = useState("");
    const authHeader = useAuthenticationHeader();
    const [ticketStatuses, setTicketStatuses] = useState<any[]>([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    useEffect(() => {
        const fetchAnnouncementsByRoleAndDepartment = async () => {
            try {
                const response = await AnnounceManageApi.getAnnouncesByRoleAndDepartment(authHeader, role, department);
                if (response.success) {
                    setAnnouncements(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };

        const fetchTickets = async () => {
            try {
                const response = await TicketManageApi.getTicketsDashboard(authHeader, role, userId);

                if (response.success) {
                    setTickets(response.data);
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
                console.error("Failed to fetch username:", error);
            }
        };

        fetchTicketStatuses().then();
        fetchTickets().then();
        fetchAnnouncementsByRoleAndDepartment().then();
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddTicket = async () => {
        try {
            const ticketDto = {
                appUserId: userId,
                content: newTicketContent,
                status: 1,
                isActive: true
            };

            const response = await TicketManageApi.create(authHeader, ticketDto);

            if (response.success) {
                setTickets([...tickets, response.data]);
                setShowModal(false);
                setNewTicketContent(""); // Reset the form
            } else {
                console.error("Failed to add ticket:", response.message);
            }
        } catch (error) {
            console.error("Error adding ticket:", error);
        }
    };

    const getStatusNameById = (id: number): string => {
        const status = ticketStatuses.find((status: any) => status.id === id);
        return status ? status.statusName : 'Unknown';
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Announcements</h2>
                    {announcements.map((announce) => (
                        <Row key={announce.id} className="mb-2">
                            <Col>
                                <Card className="notification-row">
                                    <Card.Body className="text-danger d-flex align-items-center">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                                        <Card.Text>{announce.content}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="d-flex justify-content-start align-items-center">
                        <h2 className={"me-2"}>Tickets</h2>
                        <Button variant="primary" onClick={handleShowModal}>
                            <FontAwesomeIcon icon={faPlus} /> Add
                        </Button>
                    </div>
                    <Row>
                        {tickets.map((ticket) => (
                            <Col key={ticket.id} sm={12} md={6} lg={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>{ticket.content}</Card.Text>
                                        <Card.Text>Status: {getStatusNameById(ticket.status)}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicContent">
                            <Form.Label column={"sm"}>Content:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Input Content"
                                value={newTicketContent}
                                onChange={(e) => setNewTicketContent(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddTicket}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};