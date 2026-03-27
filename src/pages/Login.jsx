import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AISLogo } from '../assets/AISLogo';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1B3E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      {/* Gold accent top bar */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:'4px', background:'#C9A84C' }} />

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'36px', gap:'12px' }}>
          <AISLogo size={72} />
          <div style={{ textAlign:'center' }}>
            <div style={{ fontWeight:900, fontSize:'18px', color:'#0D1B3E', letterSpacing:'0.06em' }}>
              THE AMERICAN INTERNATIONAL SCHOOL
            </div>
            <div style={{ color:'#C9A84C', fontSize:'12px', fontWeight:600, letterSpacing:'0.1em', marginTop:'4px' }}>
              FACILITY MANAGEMENT SYSTEM
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#6B7280', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width:'100%', padding:'12px 14px', borderRadius:'8px',
                border:'1.5px solid #E5E7EB', fontSize:'14px', outline:'none',
                fontFamily:'inherit', boxSizing:'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#0D1B3E'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#6B7280', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width:'100%', padding:'12px 14px', borderRadius:'8px',
                border:'1.5px solid #E5E7EB', fontSize:'14px', outline:'none',
                fontFamily:'inherit', boxSizing:'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#0D1B3E'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'8px', padding:'10px 14px', color:'#DC2626', fontSize:'13px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop:'8px',
              padding:'14px',
              background: loading ? '#9CA3AF' : '#0D1B3E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ marginTop:'24px', borderTop:'1px solid #F3F4F6', paddingTop:'16px', textAlign:'center', fontSize:'11px', color:'#9CA3AF' }}>
          Admin access only · pixtra.co/admin
        </div>
      </div>
    </div>
  );
}
