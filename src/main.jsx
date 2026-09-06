import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px 20px', color: '#F4F0E8', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '400px', margin: '50px auto', background: 'rgba(42, 16, 46, 0.9)', borderRadius: '20px', border: '1px solid #D92772' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>حدث خطأ في تشغيل اللعبة</h2>
          <p style={{ color: '#E5B91A', fontSize: '13px', wordBreak: 'break-word', marginBottom: '20px' }}>
            {this.state.error?.toString()}
          </p>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch(e) {}
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#D92772',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'black',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            إعادة ضبط وتحديث اللعبة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
