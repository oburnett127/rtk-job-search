import { Link } from 'react-router-dom';
import classes from './JobItem.module.css';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from 'react-redux';

function JobItem({ job }) {
    const user = useSelector((store) => store.auth.user);
    const userRole = user?.role;

    // console.log("user.empId: " + user?.employerId);
    // console.log("job.empId: " + job.employerId);

    return (
        <article className={classes.job}>
            <h2>{job.title}</h2>
            <h3>{job.employerName}</h3>
            <time>{job.postDate}</time>
            <p>{job.description}</p>
            <menu className={classes.actions}>
                { 
                  userRole === 'USER' && (
                        <Link to={{ pathname: `/jobs/${job.id}/apply` }} state={{job}}>
                            <CheckIcon />
                        </Link>
                    )
                }
                {
                  userRole === 'EMPLOYER' && user?.employerId === job.employerId && (
                    <>
                        <Link to={{ pathname: `/jobs/${job.id}/edit` }} state={{job}}>
                                <EditIcon />
                        </Link>
                        <Link to={{ pathname: `/jobs/${job.id}/delete` }}>
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