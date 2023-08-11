import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classes from './JobUpdateForm.module.css';

const JobUpdateForm = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [job, setJob] = useState(null);
    const { id } = useParams();

    const {register, handleSubmit, formState: {errors}} = useForm();
    const jwtToken = localStorage.getItem('jwtToken');

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

    const onSubmit = async (data) => {
        const { title, description } = data;

        setIsSubmitting(true);
        
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + `/job/update/${job.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });
    
            if(!response.ok) {
                setMessage('Job update failed.');
                console.error('Job update failed.');
            } else {
                setMessage("Job update was successful.");
            }
        } catch (error) {
            setMessage('Job update failed due to network error.');
            console.error('Network error:', error);
        }
    
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        navigate('/jobs');
      }

    return (
        <>
            <p className={classes.message}>{message}</p>
            <form errors={errors} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" {...register("title", {required: true})} />
                </div>
                {errors?.title && <span>The title is required.</span>}
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea {...register("description", {required: true})} />
                </div>
                {errors?.description && <span>The description is required.</span>}
                <button type="button" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit">Submit</button>
            </form>
        </>
    );
};

export default JobUpdateForm;
