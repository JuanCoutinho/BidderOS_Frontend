import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useUpdateSettingsMutation } from '../store/authApi';
import { setUser } from '../store/authSlice';

export default function OnboardingPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
    const [apiKey, setApiKey] = useState('');
    const [step, setStep] = useState(1);

    const handleSaveKey = async () => {
        if (!apiKey.trim()) return;
        try {
            const response = await updateSettings({ gemini_api_key: apiKey }).unwrap();
            dispatch(setUser(response.user));
            navigate('/dashboard');
        } catch (err: any) {
            alert('Error saving API Key: ' + (err?.data?.error || err.message));
        }
    };

    const skipOnboarding = () => {
        sessionStorage.setItem('skip_onboarding', 'true');
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>

            {/* Background Glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(3, 7, 18, 0) 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ width: '100%', maxWidth: '600px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '3rem', justifyContent: 'center' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{ height: '4px', width: '40px', borderRadius: '2px', backgroundColor: step >= s ? '#6366f1' : '#1f2937', transition: 'background-color 0.3s' }} />
                    ))}
                </div>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div className="onboarding-step" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f9fafb', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Welcome to BidderOS</h1>
                            <p style={{ fontSize: '1.15rem', color: '#9ca3af', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
                                Supercharge your job hunt with AI-powered resume matching and hyper-personalized cover letters.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            style={{ width: '100%', background: '#6366f1', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                            onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                        >
                            Get Started
                        </button>
                    </div>
                )}

                {/* Step 2: BYOK Explanation */}
                {step === 2 && (
                    <div className="onboarding-step" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f9fafb', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Bring Your Own AI</h2>
                            <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem' }}>
                                BidderOS runs on Google Gemini. To keep this platform blazing fast and free of AI subscription fees for you, we use a <strong>Bring Your Own Key (BYOK)</strong> model.
                            </p>

                            <div style={{ background: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937', textAlign: 'left' }}>
                                <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                                    <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Google AI Studio</a>.</li>
                                    <li>Sign in and click <strong>"Create API Key"</strong>.</li>
                                    <li>Copy the generated key to your clipboard.</li>
                                </ol>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setStep(1)}
                                style={{ flex: 1, background: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                style={{ flex: 2, background: '#6366f1', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                            >
                                I have my Key →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Input Key */}
                {step === 3 && (
                    <div className="onboarding-step" style={{ animation: 'fadeIn 0.5s ease-out', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f9fafb', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Connect & Unlock</h2>
                            <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: '1.6' }}>
                                Paste your Gemini API key below. It's stored securely and exclusively for your own requests.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2.5rem', width: '100%' }}>
                            <input
                                type="password"
                                placeholder="AIzaSy..."
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '1.25rem', borderRadius: '12px', border: '2px solid #374151', background: '#111827', color: 'white', fontSize: '1.1rem', outline: 'none', transition: 'border-color 0.2s', textAlign: 'center', letterSpacing: '0.1em' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#374151'}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <button
                                onClick={handleSaveKey}
                                disabled={isLoading || !apiKey.trim()}
                                style={{ width: '100%', background: '#6366f1', color: 'white', border: 'none', padding: '1.1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: apiKey.trim() ? 'pointer' : 'not-allowed', opacity: apiKey.trim() ? 1 : 0.5, transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', boxShadow: apiKey.trim() ? '0 4px 14px 0 rgba(99, 102, 241, 0.39)' : 'none' }}
                                onMouseEnter={e => { if (apiKey.trim()) e.currentTarget.style.background = '#4f46e5' }}
                                onMouseLeave={e => { if (apiKey.trim()) e.currentTarget.style.background = '#6366f1' }}
                            >
                                {isLoading ? <span className="btn-spinner" /> : 'Complete Setup'}
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 0.5rem' }}>
                                <button
                                    onClick={() => setStep(2)}
                                    style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 500, padding: '0.5rem' }}
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={skipOnboarding}
                                    style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '0.95rem', cursor: 'pointer', padding: '0.5rem' }}
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
