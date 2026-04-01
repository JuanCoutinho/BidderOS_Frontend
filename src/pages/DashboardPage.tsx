import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { useResumesQuery, useUpdateSettingsMutation } from '../store/authApi';
import { setUser } from '../store/authSlice';
import Sidebar from '../components/Sidebar';

export default function DashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const { data: resumes } = useResumesQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        if (user?.gemini_api_key) {
            setApiKey(user.gemini_api_key);
        }
    }, [user]);

    const handleSaveKey = async () => {
        try {
            const response = await updateSettings({ gemini_api_key: apiKey }).unwrap();
            dispatch(setUser(response.user));
            alert('API Key saved successfully!');
        } catch (err: any) {
            alert('Error saving API Key: ' + (err?.data?.error || err?.message || 'Unknown error'));
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-inner">
                    <div className="page-header">
                        <h1>Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
                        <p className="page-subtitle">Your BidderOS workspace is ready</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Resumes</span>
                                <span className="stat-value">{resumes?.length ?? 0}</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Member since</span>
                                <span className="stat-value">
                                    {user?.created_at
                                        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.12)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Status</span>
                                <span className="stat-value">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <p className="card-title">Account Details</p>
                        <div className="info-table">
                            <div className="info-row">
                                <span className="info-label">Name</span>
                                <span className="info-value">{user?.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">User ID</span>
                                <span className="info-value">#{user?.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: '1.5rem' }}>
                        <p className="card-title">API Settings (BYOK)</p>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                            To use BidderOS AI features (Resume matching and Cover Letters), please provide your Google AI Studio Gemini API Key. Your key is stored securely and only used for your personal requests. You can get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>aistudio.google.com</a>.
                        </p>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label htmlFor="gemini-key">Gemini API Key</label>
                            <input
                                id="gemini-key"
                                type="password"
                                placeholder="AIzaSy..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', background: '#111827', color: 'white' }}
                            />
                        </div>
                        <button
                            className="auth-button"
                            style={{ width: '150px', padding: '0.5rem 1rem', marginTop: '0.5rem' }}
                            onClick={handleSaveKey}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : 'Save API Key'}
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
