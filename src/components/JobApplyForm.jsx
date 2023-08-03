import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JobApplyForm = ({ job }) => {

    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    
    const user = useSelector((store) => store.auth.user);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("job.id: " + job.id);
        console.log("typeof user.id: " + typeof(user.id));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId: job.id.toString(), applicantId: user.id.toString() })
          };

        fetch(process.env.REACT_APP_SERVER_URL + '/application/create', requestOptions)
        .then((response) => {
            console.log(response);
            if(response.ok) {
                setMessage('Your job application was submitted.');
            }
        })
        .catch((error => {
            if(error.response) {
                console.log(error.response);
                setMessage('An error occurred. Your job application could not be submitted.');
            } else if(error.request) {
                console.log("network error");
            } else {
                console.log(error);
            }
        }));

    };

    const handleCancel = (e) => {
        navigate('..');
    };

    return (
        <form>
            <div>
                {message}<br />
                {job.title}
                <p>Are you sure you want to apply for this job?</p>
            </div>
            <button type="button" onClick={handleCancel}>
                Cancel
            </button>
            <button type="submit" onClick={handleSubmit}>
                Yes
            </button>
        </form>
    );
};

export default JobApplyForm;
