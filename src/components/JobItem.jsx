import { Link } from 'react-router-dom';
import classes from './JobItem.module.css';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from 'react-redux';

function JobItem({ job }) {
    const user = useSelector((store) => store.auth.user);
    const userRoles = user.roles;
    const jobData = job.data;

    // console.log("user.empId: " + user?.employerId);
    // console.log("job.empId: " + job.employerId);

    return (
        <article className={classes.job}>
            <h2>{job.data.title}</h2>
            <h3>{job.data.employerName}</h3>
            <time>{job.data.postDate}</time>
            <p>{job.data.description}</p>
            <menu className={classes.actions}>
                { 
                  userRole === 'USER' && (
                        <Link to={{ pathname: `/jobs/${job.data.id}/apply` }}>
                            <CheckIcon />
                        </Link>
                    )
                }
                {
                  userRoles === 'EMPLOYER' && user?.employerId === job.employerId && (
                    <>
                        <Link to={{ pathname: `/jobs/${job.data.id}/edit` }} state={{job}}>
                                <EditIcon />
                        </Link>
                        <Link to={{ pathname: `/jobs/${job.data.id}/delete` }}>
                            <ClearIcon />
                        </Link>
                    </>
                  )
                }
            </menu>
        </article>
    );
}

export default JobItem;