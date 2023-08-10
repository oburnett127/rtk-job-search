import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PrivateRoute = ({ isLoggedIn, roleReq, children }) => {

    const user = useSelector((store) => store.auth.user);

    const authorize = () => {
        setLoading(true);

        const userRole = user.roles;
        if(userRole === roleReq) setAuth(true);
        else setAuth(false);

        setLoading(false);
    }

    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        if(isLoggedIn) authorize();
    })

    return loading ? (
        <h1>Loading...</h1>
    ) : auth ? children : (
        <p>You do not have access to the requested resource</p>
    );
};

export default PrivateRoute;
