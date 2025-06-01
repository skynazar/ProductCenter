import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PhotoUpload from './pages/PhotoUpload';
import ThreadView from './pages/ThreadView';
import ProjectList from './pages/ProjectList';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<PhotoUpload />} />
            <Route path="/thread/:threadId" element={<ThreadView />} />
            <Route path="/projects" element={<ProjectList />} />
          </Routes>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default App; 