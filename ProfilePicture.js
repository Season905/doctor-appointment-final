import React, { useState, useRef } from 'react';
import { Image, Button, Spinner, Alert } from 'react-bootstrap';
import { FiCamera, FiUpload } from 'react-icons/fi';
import api from '../api';

const ProfilePicture = ({ profileData, onUpdate }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError('');

            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await api.post('/users/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (onUpdate) {
                onUpdate(response.data.profilePicture);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="text-center mb-4">
            <div
                className="position-relative d-inline-block"
                style={{ cursor: 'pointer' }}
                onClick={handleImageClick}
            >
                <Image
                    src={profileData?.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    roundedCircle
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '2px solid #dee2e6'
                    }}
                />
                <div
                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                    style={{ cursor: 'pointer' }}
                >
                    <FiCamera color="white" size={20} />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleFileChange}
            />

            {uploading && (
                <div className="mt-2">
                    <Spinner animation="border" size="sm" /> Uploading...
                </div>
            )}

            {error && (
                <Alert variant="danger" className="mt-2">
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default ProfilePicture; 