import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateStepView = () => {
    // State for storing the name and description of the step
    const [stepName, setStepName] = useState('');
    const [stepDescription, setStepDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Retrieves the API base URL from the environment variables
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002/api'; // Fallback URL for development

    // Creates a function that allows navigation programmatically within the app
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior

        try {
            // Sends a POST request to the API by appending the /steps endpoint to the base API URL
            const response = await fetch(`${apiUrl}/v1/steps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: stepName,
                    description: stepDescription
                }),
                credentials: 'include' // Ensure cookies are sent with the request
            });

            // Checks whether the HTTP response was not successful
            if (!response.ok) {
                const errorText = await response.text(); // Get raw text of the error response
                throw new Error(errorText || 'Network response was not ok');
            }

            // Takes the response from the HTTP request and converts it into JSON
            const data = await response.json();
            console.log('Step created:', data);

            // Sets success message and clears form fields
            setSuccessMessage('Step created successfully!');
            setStepName('');
            setStepDescription('');
        } catch (error) {
            console.error('Error creating step:', error);
            // Sets error message for display
            setErrorMessage(error.message || 'An error occurred while creating the step.');
        }
    };

    const handleCancel = () => {
        navigate('/'); // Redirect to home page
    };

    return (
        <div>
            <h2>Create A Step</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={stepName}
                            onChange={(e) => setStepName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            value={stepDescription}
                            onChange={(e) => setStepDescription(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
            {successMessage && <p>{successMessage}</p>} {/* Display success message */}
            {errorMessage && <p>{errorMessage}</p>} {/* Display error message */}
        </div>
    );
};

export default CreateStepView;
