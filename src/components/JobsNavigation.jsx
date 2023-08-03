import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './JobsNavigation.module.css';

function JobsNavigation() {
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const user = useSelector((store) => store.auth.user);

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              All Jobs
            </NavLink>
          </li>
          <li>
          {isLoggedIn && user?.role === 'EMPLOYER' && (
            <NavLink
              to="/jobs/new"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              New Job
            </NavLink>
          )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default JobsNavigation;
