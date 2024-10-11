import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import authenticateApi from '../api/AuthenticateApi';
import "./Profile.scss";

const Profile: React.FC = () => {
    const [cookies] = useCookies(['user']);
    const [id, setId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState<string>('');
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (cookies.user && cookies.user.id) {
            setId(cookies.user.id);
        }
    }, [cookies]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewProfilePicture(e.target.files[0]);
        }
    };

    const handleUpdate = async () => {
        if (id) {
            const response = await authenticateApi.updateUser(id, newPassword, newProfilePicture ?? undefined);
            if (response.success) {
                setMessage('User updated successfully');
            } else {
                setMessage('Failed to update user');
            }
        } else {
            setMessage('User ID is missing');
        }
    };

    return (
        <div className="profile-container">
            <Form>
                <Form.Group controlId="formNewPassword">
                    <Form.Label column={"sm"}>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formNewProfilePicture">
                    <Form.Label column={"sm"}>New Profile Picture</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                    />
                </Form.Group>
                <Button variant="primary" className={"update-button"} onClick={handleUpdate}>
                    Update Profile
                </Button>
            </Form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Profile;