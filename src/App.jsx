import { AuthProvider, useAuth } from './hooks/useAuth';
import Login       from './pages/Login';
import AdminLayout from './pages/AdminLayout';

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:'#0D1B3E', fontFamily:'Arial',
      }}>
        <div style={{ color:'#C9A84C', fontSize:14, fontWeight:700, letterSpacing:'0.1em' }}>
          LOADING…
        </div>
      </div>
    );
  }

  return user ? <AdminLayout /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
