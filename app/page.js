
import WaitingTimePredictor from './components/WaitingTimePredictor';
import AppointmentScheduler from './components/AppointmentScheduler';
import ResourceAllocator from './components/ResourceAllocator';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Diseases from './components/Diseases';
import JoinNow from './components/JoinNow';

export default function Home() {
  return (     
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen font-sans">
        {/* <WaitingTimePredictor />
        <AppointmentScheduler />
        <ResourceAllocator /> */}
        <HomePage />
        <Diseases />
        <JoinNow />
      </div>
  );
}
