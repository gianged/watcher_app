import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";
import AnnounceManageApi from "../api/AnnounceManageApi";
import TicketManageApi from "../api/TicketManageApi.ts";
import useAuthenticationHeader from "../providers/AuthenticateHeaderProvider.tsx";

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
    const [cookies] = useCookies(['user']);
    const userId = cookies.user?.id;

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await AnnounceManageApi.getAll(authHeader);

                if (response.success) {
                    const filteredAnnouncements = response.data.filter((announce: any) =>
                        announce.isPublic || (role >= 3 && role <= 4 && announce.departmentId === department)
                    );
                    setAnnouncements(filteredAnnouncements);
                }
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };

        const fetchTickets = async () => {
            try {
                const response = role === 1 || role === 2
                    ? await TicketManageApi.getAll(authHeader)
                    : await TicketManageApi.getTicketsByAppUserId(authHeader, userId);

                if (response.success) {
                    setTickets(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            }
        };

        fetchTickets().then();
        fetchAnnouncements().then();
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

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Announcements</h2>
                    <Row>
                        {announcements.map((announce) => (
                            <Col key={announce.id} sm={12} md={6} lg={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>{announce.content}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
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