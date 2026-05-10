import { Navigate, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { ResetPassword } from '@/pages/ResetPassword';
import { Agreement } from '@/pages/Agreement';
import { NotFound } from '@/pages/NotFound';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/spirit" element={<Navigate to="/#vision" replace />} />
                <Route path="/services" element={<Navigate to="/#services" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/agreement/:type" element={<Agreement />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
