import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JournalProvider } from './context/JournalContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import NewEntry from './pages/NewEntry';
import EditEntry from './pages/EditEntry';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <JournalProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:id" element={<JournalDetail />} />
              <Route path="/journal/edit/:id" element={<EditEntry />} />
              <Route path="/journal/new" element={<NewEntry />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Layout>
        </JournalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
