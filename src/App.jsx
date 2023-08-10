import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import ApplyJobPage from './pages/ApplyJobPage';
import UpdateJobPage from './pages/UpdateJobPage';
import JobDetailPage from './pages/JobDetailPage';
import JobsPage from './pages/JobsPage';
import JobsRootLayout from './pages/JobsRoot';
import HomePage from './pages/HomePage';
import NewJobPage from './pages/NewJobPage';
import RootLayout from './pages/Root';
import DeleteJobPage from './pages/DeleteJobPage';
import AuthenticationPage from './pages/AuthenticationPage';
import LogoutPage from './pages/LogoutPage';
import NotFoundPage from './pages/NotFoundPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import PrivateRoute from './PrivateRoute';
import { useSelector } from 'react-redux';

function App() {

    const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />}></Route>
                <Route path="/auth" element={<AuthenticationPage />}></Route>
                <Route path="/logout" element={<LogoutPage />}></Route>
                <Route path="/jobs" element={<JobsRootLayout />}>
                    <Route index element={<JobsPage />}></Route>
                    <Route path="/jobs/:id" id="job-detail">
                        <Route index element={<JobDetailPage />}></Route>
                        <Route path="apply" element={<ApplyJobPage />}></Route>
                        <Route path="edit" element={
                            <PrivateRoute isLoggedIn={isLoggedIn} roleReq={"EMPLOYER"}>
                                <UpdateJobPage />
                            </PrivateRoute>}>
                        </Route>
                        <Route path="delete" element={
                            <PrivateRoute isLoggedIn={isLoggedIn} roleReq={"EMPLOYER"}>
                                <DeleteJobPage />
                            </PrivateRoute>}>
                        </Route>
                    </Route>
                    <Route path="/jobs/new" element={
                        <PrivateRoute isLoggedIn={isLoggedIn} roleReq={"EMPLOYER"}>
                            <NewJobPage />
                        </PrivateRoute>}>
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />}></Route>
            </Route>
        )
    );

    return (
        <QueryClientProvider client={new QueryClient()}>
                <div className={"App"}>
                    <RouterProvider router={router} />
                </div>
        </QueryClientProvider>
    );
}

export default App;
