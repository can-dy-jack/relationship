import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import CharacterPage from './views/Character';
import GroupsPage from './views/Groups';
import RelationPage from './views/Relation';
import Layout from './Layout';
import Home from './views/Home';
import './App.css';

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/relation" element={<RelationPage />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}
