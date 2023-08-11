import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JobApplyForm = () => {

    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const jwtToken = localStorage.getItem('jwtToken');

    const user = useSelector((store) => store.auth.user);

    useEffect(() => {
        async function fetchData() {
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await fetch(process.env.REACT_APP_SERVER_URL + '/job/get/' + id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            })
            
            if (!response.ok) {
                setMessage('An error occurred. Job details could not be retrieved.');
                throw new Error('Job details could not be retrieved.');
            }
            setJob(await response.json());
        }

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("job.id: " + job.id);
        console.log("typeof user.id: " + typeof(user.id));

        setIsSubmitting(true);

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + '/application/create', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ jobId: job.id.toString(), applicantId: user.id.toString() })
            })
            
            if(!response.ok) {
                setMessage('An error occurred. Your job application could not be submitted.');
                console.error('application submit failed.');
            } else {
                setMessage("Your job application was submitted successfully.");
            }
        } catch(error) {
            setMessage('Application submit failed.');
            console.error('error:', error);
        }

        setIsSubmitting(false);
    };

    const handleCancel = (e) => {
        navigate('/jobs');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {message}<br />
                {job ? job.title : 'Loading...'}
                <p>Are you sure you want to apply for this job?</p>
            </div>
            <button type="button" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
                Yes
            </button>
        </form>
    );
};

export default JobApplyForm;
