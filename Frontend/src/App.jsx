import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import ApplyJob from './pages/ApplyJob';
import ApplicationDashboard from './pages/ApplicationDashboard';

import Applicants from './pages/Applicants';
import ApplicantDetails from './pages/ApplicantDetails';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/apply/:jobId" element={<ApplyJob />} />
          <Route path="/applications" element={<ApplicationDashboard />} />
          <Route path="/applications/job/:jobId" element={<Applicants />} />

          <Route
            path="/applications/:applicationId"
            element={<ApplicantDetails />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
