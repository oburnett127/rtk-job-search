import React from 'react';
import { Form, useNavigate, useNavigation, useActionData, json, redirect } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import classes from './JobPostForm.module.css';
import { useState } from "react";

function JobPostForm({ method }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  function cancelHandler() {
    navigate('..');
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const createJob = useMutation(
      (formData) => axios.post('http://localhost:8080/job/create', formData),
      {
            onSuccess: () => {
              console.log('Job created successfully.');
              setMessage('Job created successfully.');
              setSuccess(true);
            },
            onError: () => {
              console.log('An error occurred. Job could not be saved.');
              setMessage('An error occurred. Job could not be saved.');
            }
      }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createJob.mutate({ title, description });
  };

  return (
    <>
      <p className={classes.message}>{message}</p>
      {
        !success &&
        <Form method={method} className={classes.form} onSubmit={handleSubmit}>
          {data && data['errors'] && (
            <ul>
              {Object.values(data['errors'].map((err) => (
                <li key={err}>{err}</li>
              )))}
            </ul>
          )}
          <p>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </p>
          <p>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </p>
          <div className={classes.actions}>
            <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
              Cancel
            </button>
            <button disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Save'}
            </button>
          </div>
        </Form>
      }
    </>
  );
}

export default JobPostForm;