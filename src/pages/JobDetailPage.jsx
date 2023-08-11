import React from 'react';
import axios from "axios";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import JobItem from "../components/JobItem";

function JobDetailPage() {
    const {id} = useParams();

    const jwtToken = localStorage.getItem('jwtToken');

    const { isLoading, error, data: jobDetail } = useQuery('jobDetail', () =>
        axios.get(process.env.REACT_APP_SERVER_URL + '/job/get/' + id, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            }
        })
    );

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error['message']}</div>;

    return <JobItem job={jobDetail} />
}

export default JobDetailPage;