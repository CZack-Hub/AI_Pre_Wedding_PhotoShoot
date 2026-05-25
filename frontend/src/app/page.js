'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  RefreshCw, 
  Layers, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Info, 
  Settings,
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';

const backdrops = [
  { id: 'udaipur', name: 'Udaipur Palace', desc: 'Royal heritage, lake reflections, sunset vibes', image: '/prewedding_udaipur.png' },
  { id: 'alps', name: 'Swiss Alps', desc: 'Snowy peaks, luxury pine chalets, sunny skies', image: '/prewedding_alps.png' },
  { id: 'goa', name: 'Goa Golden Beach', desc: 'Sandy shores, swaying palms, ocean breeze', gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)' },
  { id: 'kashmir', name: 'Kashmir Valleys', desc: 'Blooming tulip fields, snow-dusted ridges', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' }
];

const outfits = [
  { id: 'lehenga_sherwani', name: 'Royal Lehenga & Sherwani', desc: 'Intricately embroidered traditional velvet/silk attire' },
  { id: 'gown_suit', name: 'Western Gown & Tuxedo', desc: 'Elegant white bridal gown & modern black tuxedo' },
  { id: 'casual_linen', name: 'Resort Linen Casuals', desc: 'Lighter linen suits, floral summer dresses' }
];

export default function Home() {
  // App states
  const [selectedBackdrop, setSelectedBackdrop] = useState(backdrops[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(outfits[0]);
  const [selfies, setSelfies] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState([
    {
      id: 'job-9821',
      type: 'photo',
      backdrop: 'Udaipur Palace',
      outfit: 'Royal Lehenga & Sherwani',
      status: 'completed',
      progress: 100,
      timestamp: '2 hours ago',
      output: '/prewedding_udaipur.png'
    },
    {
      id: 'job-9820',
      type: 'photo',
      backdrop: 'Swiss Alps',
      outfit: 'Western Gown & Tuxedo',
      status: 'completed',
      progress: 100,
      timestamp: '5 hours ago',
      output: '/prewedding_alps.png'
    }
  ]);
  const [activeOutput, setActiveOutput] = useState('/prewedding_udaipur.png');
  const [apiStatus, setApiStatus] = useState('offline');
  const [apiDetails, setApiDetails] = useState(null);
  const [generationType, setGenerationType] = useState('photo'); // photo | video

  // Environment status mock checks
  const [envConfig, setEnvConfig] = useState({
    supabase: true,
    r2: false,
    redis: false,
    inngest: false
  });

  // Fetch Python API health on load
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        if (res.ok) {
          const data = await res.json();
          setApiStatus('online');
          setApiDetails(data.services);
          setEnvConfig({
            supabase: data.services.supabase === 'ok',
            r2: data.services.cloudflare_r2 === 'ok',
            redis: data.services.redis === 'ok',
            inngest: true
          });
        }
      } catch (err) {
        setApiStatus('offline');
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  // Simulate selfie uploads
  const handleUploadSelfies = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newSelfies = [
        { name: 'bride_portrait_1.jpg', size: '2.4 MB' },
        { name: 'groom_portrait_1.jpg', size: '1.9 MB' },
        { name: 'couple_angle_2.jpg', size: '3.1 MB' }
      ];
      setSelfies(newSelfies);
      setIsUploading(false);
    }, 1500);
  };

  // Trigger simulated generation
  const handleGenerate = () => {
    if (selfies.length === 0) {
      alert('Please upload reference selfies to train the AI model first.');
      return;
    }

    const newJobId = `job-${Math.floor(1000 + Math.random() * 9000)}`;
    const newJob = {
      id: newJobId,
      type: generationType,
      backdrop: selectedBackdrop.name,
      outfit: selectedOutfit.name,
      status: 'pending',
      progress: 0,
      timestamp: 'Just now',
      output: selectedBackdrop.image || '/prewedding_udaipur.png'
    };

    setJobs(prev => [newJob, ...prev]);

    // Simulate background worker progress (pending -> processing -> completed)
    let currentProgress = 0;
    const interval = setInterval(() => {
      setJobs(prevJobs => {
        return prevJobs.map(j => {
          if (j.id === newJobId) {
            if (currentProgress < 15) {
              currentProgress += 5;
              return { ...j, status: 'processing', progress: currentProgress };
            } else if (currentProgress < 90) {
              currentProgress += Math.floor(Math.random() * 15) + 5;
              return { ...j, status: 'processing', progress: Math.min(currentProgress, 95) };
            } else {
              clearInterval(interval);
              // Set output view to this newly generated image on completion
              setTimeout(() => {
                setActiveOutput(j.output);
              }, 500);
              return { ...j, status: 'completed', progress: 100 };
            }
          }
          return j;
        });
      });
    }, 1000);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="grid-bg"></div>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1.25rem 2rem',
        background: 'rgba(3, 7, 18, 0.7)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
                ITVoice <span className="gradient-text">Virtual Studio</span>
              </h1>
            </div>
          </div>

          {/* Connection Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <Database size={14} color={envConfig.supabase ? '#10b981' : '#6b7280'} />
              <span style={{ color: 'var(--text-muted)' }}>Supabase:</span>
              <span style={{ color: envConfig.supabase ? '#10b981' : '#6b7280', fontWeight: 600 }}>{envConfig.supabase ? 'Connected' : 'Mock'}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <HardDrive size={14} color={envConfig.r2 ? '#10b981' : '#6b7280'} />
              <span style={{ color: 'var(--text-muted)' }}>R2 Storage:</span>
              <span style={{ color: envConfig.r2 ? '#10b981' : '#6b7280', fontWeight: 600 }}>{envConfig.r2 ? 'Active' : 'Offline'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <RefreshCw size={14} className={apiStatus === 'online' ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} color={apiStatus === 'online' ? '#10b981' : '#ef4444'} />
              <span style={{ color: 'var(--text-muted)' }}>Python API:</span>
              <span style={{ color: apiStatus === 'online' ? '#10b981' : '#ef4444', fontWeight: 600 }}>{apiStatus.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Hero Section */}
        <section className="glass-card" style={{
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.15), transparent 60%), var(--bg-surface)'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.35rem 0.8rem', borderRadius: '20px', marginBottom: '1.25rem' }}>
              <Sparkles size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI-Powered Virtual Dressing & Backdrop swapping</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              Generate Cinematic <span className="gradient-text">Pre-Wedding Reels</span> & Photos Instantly
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Skip the expensive destination shoots. Train an identity-preserving AI model on a few selfies, select exotic global locales, swap outfits in one click, and run asynchronous video rendering pipelines.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#studio-workspace" className="btn-primary">
                Launch Workspace <ChevronRight size={18} />
              </a>
              <a href="#env-variables" className="btn-secondary">
                View Tech Stack & env Config
              </a>
            </div>
          </div>
        </section>

        {/* Studio Workspace */}
        <section id="studio-workspace" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Step 1: Upload Selfies & Identity config (4 Columns) */}
          <div className="glass-card" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--color-primary)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>1</span>
              <h3 style={{ fontSize: '1.15rem' }}>Train Face Identity</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
              Upload 10-20 high-quality photos of the couple to generate consistent facial models.
            </p>

            <div 
              onClick={handleUploadSelfies}
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: '12px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(0,0,0,0.15)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              {isUploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <RefreshCw className="animate-spin" size={32} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Uploading & training face profiles...</span>
                </div>
              ) : selfies.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={32} color="var(--color-success)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)' }}>Training Dataset Loaded</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selfies.length} files uploaded successfully</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <Upload size={32} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to Upload Selfies</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports PNG, JPEG up to 10MB</span>
                </div>
              )}
            </div>

            {selfies.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Dataset:</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                  {selfies.map((s, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                      <span>📄 {s.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{s.size}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pipeline Configuration Parameters */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Identity Preservation strength</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>85%</span>
              </div>
              <input type="range" min="50" max="100" defaultValue="85" style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Face Matching Iterations</span>
                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>500 steps</span>
              </div>
              <input type="range" min="100" max="1000" step="50" defaultValue="500" style={{ width: '100%', accentColor: 'var(--color-secondary)', cursor: 'pointer' }} />
            </div>
          </div>

          {/* Step 2: Settings: Backdrop & Outfit (4 Columns) */}
          <div className="glass-card" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--color-primary)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>2</span>
              <h3 style={{ fontSize: '1.15rem' }}>Select Locale & Wardrobe</h3>
            </div>
            
            {/* Locale list */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Backdrop Locations</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {backdrops.map((b) => (
                  <div 
                    key={b.id}
                    onClick={() => setSelectedBackdrop(b)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selectedBackdrop.id === b.id ? 'var(--color-primary)' : 'var(--border-subtle)',
                      background: selectedBackdrop.id === b.id ? 'rgba(139, 92, 246, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.name}</span>
                      {selectedBackdrop.id === b.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outfit list */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Outfits Swapper</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {outfits.map((o) => (
                  <div 
                    key={o.id}
                    onClick={() => setSelectedOutfit(o)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selectedOutfit.id === o.id ? 'var(--color-secondary)' : 'var(--border-subtle)',
                      background: selectedOutfit.id === o.id ? 'rgba(236, 72, 153, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{o.name}</span>
                      {selectedOutfit.id === o.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-secondary)' }}></div>}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{o.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Trigger & Active Output / Queue (4 Columns) */}
          <div className="glass-card" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--color-primary)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>3</span>
              <h3 style={{ fontSize: '1.15rem' }}>Generate & Monitor</h3>
            </div>

            {/* Output formats selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => setGenerationType('photo')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: generationType === 'photo' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: generationType === 'photo' ? 'var(--text-main)' : 'var(--text-muted)'
                }}
              >
                <ImageIcon size={14} /> Photo Mode
              </button>
              <button 
                onClick={() => setGenerationType('video')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: generationType === 'video' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: generationType === 'video' ? 'var(--text-main)' : 'var(--text-muted)'
                }}
              >
                <Video size={14} /> Video Reel
              </button>
            </div>

            {/* Run Button */}
            <button 
              onClick={handleGenerate}
              className="btn-primary animate-glow" 
              style={{
                width: '100%',
                padding: '1rem',
                justifyContent: 'center',
                fontSize: '1rem',
                borderRadius: '12px'
              }}
            >
              <Sparkles size={18} />
              Generate Cinematic {generationType === 'photo' ? 'Photos' : 'Video Reel'}
            </button>

            {/* Active generation progress queue */}
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', maxH: '250px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Background Jobs & Webhooks</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {jobs.map((job) => (
                  <div 
                    key={job.id}
                    onClick={() => job.status === 'completed' && setActiveOutput(job.output)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      cursor: job.status === 'completed' ? 'pointer' : 'default',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Job ID: <strong>{job.id}</strong></span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        background: job.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : job.status === 'processing' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: job.status === 'completed' ? '#10b981' : job.status === 'processing' ? '#8b5cf6' : '#f59e0b'
                      }}>
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      {job.type === 'video' ? '🎥 Video' : '🖼️ Photo'} Swap: {job.backdrop}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Wear: {job.outfit} • {job.timestamp}
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${job.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                        transition: 'width 0.5s ease-out'
                      }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      <span>Webhook status: Inngest Triggered</span>
                      <span>{job.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preview and Gallery Showcase */}
        <section className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Preview Rendering Gallery</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Select a finished job from the queue above to load the high-fidelity output.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            {/* Left Column: Visual output (7 Columns) */}
            <div style={{ gridColumn: 'span 7', position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
              {activeOutput.startsWith('/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={activeOutput} 
                  alt="AI Generated Pre-wedding photo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    maxHeight: '500px',
                    transition: 'var(--transition-smooth)'
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', minHeight: '400px', background: activeOutput, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Sparkles size={48} className="animate-pulse" style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Generating Hyper-Realistic Backdrop Match</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.5rem' }}>
                      Rendering composition, lighting maps, and details...
                    </p>
                  </div>
                </div>
              )}
              
              {/* Premium overlay badge */}
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
                background: 'rgba(3, 7, 18, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Sparkles size={14} color="var(--color-primary)" />
                <span>AI Preserve Identity: <strong>Enabled</strong></span>
              </div>
            </div>

            {/* Right Column: API & Integration Details (5 Columns) */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '1.25rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                  <Info size={16} color="var(--color-primary)" /> Project Integration Architecture
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  This pre-wedding studio connects a highly responsive **Next.js frontend** with an async **FastAPI Python backend**. Photos are backed up in **Cloudflare R2**, and job state machines run via **Supabase PostgreSQL** and **Inngest/Redis** workers.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Backend Integration</span>
                    <span style={{ fontWeight: 600 }}>Python FastAPI (v3.14)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Database & Auth</span>
                    <span style={{ fontWeight: 600 }}>PostgreSQL via Supabase</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>File Uploads Storage</span>
                    <span style={{ fontWeight: 600 }}>Cloudflare R2 Bucket</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Background Workers</span>
                    <span style={{ fontWeight: 600 }}>Redis & Inngest Webhooks</span>
                  </div>
                </div>
              </div>

              {/* Quick instructions panel */}
              <div style={{ background: 'rgba(139, 92, 246, 0.03)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '1.25rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <Play size={16} /> How to Test Integration locally
                </h4>
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>Create a local <code style={{ color: 'var(--color-secondary)' }}>.env</code> file in the backend folder.</li>
                  <li>Configure the Supabase URL, Key, R2 Storage bucket and Redis connection string.</li>
                  <li>Run <code style={{ color: 'var(--text-main)' }}>python main.py</code> inside the backend folder.</li>
                  <li>Upload selfies in Step 1, select a location in Step 2, and trigger a generation in Step 3!</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Config variables list */}
        <section id="env-variables" className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Settings size={20} color="var(--color-secondary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Required Environment Variables</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={14} /> Backend Configuration (<code>backend/.env</code>)
              </h4>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.5
              }}>
{`# Server Port
PORT=5000

# Supabase Configurations
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_KEY=[anon-public-key]

# Cloudflare R2 Credentials
CF_R2_ACCESS_KEY_ID=[access-key-id]
CF_R2_SECRET_ACCESS_KEY=[secret-access-key]
CF_R2_ENDPOINT_URL=https://[account-id].r2.cloudflarestorage.com
CF_R2_BUCKET_NAME=[bucket-name]

# Redis Cache URL
REDIS_URL=redis://localhost:6379/0`}
              </pre>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={14} /> Frontend Configuration (<code>frontend/.env.local</code>)
              </h4>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.5
              }}>
{`# Supabase Client Credentials
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-public-key]

# Backend connection URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`}
              </pre>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem',
        background: 'rgba(3, 7, 18, 0.8)',
        marginTop: 'auto',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <p>© 2026 ITVoice AI-Powered Virtual Studio. Designed with visual excellence and premium responsive UX.</p>
      </footer>
    </div>
  );
}
