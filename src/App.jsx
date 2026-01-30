import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JournalProvider } from './context/JournalContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import NewEntry from './pages/NewEntry';

function App() {
  return (
    <Router>
      <JournalProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalDetail />} />
            <Route path="/journal/new" element={<NewEntry />} />
          </Routes>
        </Layout>
      </JournalProvider>
    </Router>
  );
}

export default App;
