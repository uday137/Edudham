import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Trash2, Save, RefreshCw, Image, ArrowUp, ArrowDown,
    Eye, Type, Clock, Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { toast } from 'sonner';

const DEFAULT_CONFIG = {
    hero_title: 'Find Your Perfect',
    hero_title_highlight: 'College Match',
    hero_subtitle:
        'Explore universities across Uttar Pradesh. Compare courses, fees, and facilities to make the right choice for your future.',
    cta_text: 'Search',
    background_images: [
        'https://images.unsplash.com/photo-1680084521806-b408d976e3e7?crop=entropy&cs=srgb&fm=jpg&q=85',
        'https://images.unsplash.com/photo-1562774053-701939374585?crop=entropy&cs=srgb&fm=jpg&q=85',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=srgb&fm=jpg&q=85',
        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?crop=entropy&cs=srgb&fm=jpg&q=85',
    ],
    slide_interval_ms: 5000,
    site_name: 'Edu Dham',
    logo_url: '',
    hero_title_color: '#ffffff',
    hero_highlight_color: '#f97316',
    hero_subtitle_color: '#cbd5e1',
    show_footer: false,
};

/* ── ImageRow ───────────────────────────────────────── */
const ImageRow = ({ url, index, total, onChange, onRemove, onMoveUp, onMoveDown }) => {
    const [input, setInput] = useState(url);
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Max 5 MB'); return; }
        setUploading(true);
        try {
            const res = await api.uploadUniversityPhoto(file);      // reuses existing endpoint
            onChange(res.photo_url);
            setInput(res.photo_url);
            toast.success('Image uploaded');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            border: '1.5px solid #e2e8f0', background: '#fafbff',
            marginBottom: '8px',
        }}>
            {/* Preview thumbnail */}
            <div style={{
                width: '72px', height: '46px', borderRadius: '6px',
                overflow: 'hidden', flexShrink: 0,
                background: '#e2e8f0',
                border: '1px solid #cbd5e1',
            }}>
                {input ? (
                    <img src={input} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Image size={20} color="#94a3b8" />
                    </div>
                )}
            </div>

            {/* URL input */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); onChange(e.target.value); }}
                    placeholder="Paste image URL or upload…"
                    style={{
                        width: '100%', padding: '6px 10px', borderRadius: '6px',
                        border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none',
                        fontFamily: 'monospace',
                    }}
                />
            </div>

            {/* Upload button */}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                title="Upload image"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '32px', height: '32px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer',
                    flexShrink: 0,
                }}
            >
                <Upload size={14} color={uploading ? '#94a3b8' : '#475569'} />
            </button>

            {/* Move up */}
            <button type="button" onClick={onMoveUp} disabled={index === 0} title="Move up"
                style={{
                    width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer',
                    opacity: index === 0 ? 0.3 : 1, flexShrink: 0,
                }}>
                <ArrowUp size={13} color="#475569" />
            </button>

            {/* Move down */}
            <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Move down"
                style={{
                    width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer',
                    opacity: index === total - 1 ? 0.3 : 1, flexShrink: 0,
                }}>
                <ArrowDown size={13} color="#475569" />
            </button>

            {/* Remove */}
            <button type="button" onClick={onRemove} title="Remove"
                style={{
                    width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', border: '1px solid #fecaca', background: '#fff5f5', cursor: 'pointer',
                    flexShrink: 0,
                }}>
                <Trash2 size={13} color="#ef4444" />
            </button>
        </div>
    );
};

/* ── LogoUploader ───────────────────────────────────── */
const LogoUploader = ({ value, onChange }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Max 5 MB'); return; }
        setUploading(true);
        try {
            const res = await api.uploadUniversityPhoto(file);
            onChange(res.photo_url);
            toast.success('Logo uploaded!');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '7px',
                    border: '1.5px solid #6366f1', background: '#eff6ff',
                    color: '#4338ca', fontWeight: 600, fontSize: '12px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                }}
            >
                <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Logo'}
            </button>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="or paste image URL…"
                style={{
                    flex: 1, padding: '6px 10px', borderRadius: '6px',
                    border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none',
                    fontFamily: 'monospace',
                }}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    style={{ padding: '4px 8px', borderRadius: '5px', border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                >
                    Remove
                </button>
            )}
        </div>
    );
};


const HomepageEditor = () => {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [previewSlide, setPreviewSlide] = useState(0);

    useEffect(() => {
        fetchConfig();
    }, []);

    // Auto-rotate preview
    useEffect(() => {
        if (config.background_images.length < 2) return;
        const t = setInterval(() => {
            setPreviewSlide((p) => (p + 1) % config.background_images.length);
        }, 2500);
        return () => clearInterval(t);
    }, [config.background_images.length]);

    const fetchConfig = async () => {
        try {
            const data = await api.getHomepageConfig();
            setConfig({ ...DEFAULT_CONFIG, ...data });
        } catch {
            toast.error('Failed to load homepage config');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateHomepageConfig(config);
            toast.success('Homepage updated! Changes are live immediately.');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const updateImage = (index, url) => {
        const imgs = [...config.background_images];
        imgs[index] = url;
        setConfig({ ...config, background_images: imgs });
    };

    const removeImage = (index) => {
        const imgs = config.background_images.filter((_, i) => i !== index);
        setConfig({ ...config, background_images: imgs });
        setPreviewSlide((p) => Math.min(p, imgs.length - 1));
    };

    const moveImage = (index, dir) => {
        const imgs = [...config.background_images];
        const target = index + dir;
        if (target < 0 || target >= imgs.length) return;
        [imgs[index], imgs[target]] = [imgs[target], imgs[index]];
        setConfig({ ...config, background_images: imgs });
    };

    const addUrl = () => {
        const trimmed = newUrl.trim();
        if (!trimmed) return;
        setConfig({ ...config, background_images: [...config.background_images, trimmed] });
        setNewUrl('');
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                <p>Loading homepage config…</p>
            </div>
        );
    }

    const currentPreviewImg = config.background_images[previewSlide] || config.background_images[0];

    return (
        <div style={{ maxWidth: '900px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Homepage Editor</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
                        Changes are saved to the database and reflected on the live homepage instantly.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outline" onClick={fetchConfig} style={{ gap: '6px' }}>
                        <RefreshCw size={14} /> Reset
                    </Button>
                    <Button onClick={handleSave} disabled={saving} style={{ gap: '6px', background: '#6366f1', color: '#fff' }}>
                        <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* LIVE MINI-PREVIEW */}
            <div style={{
                position: 'relative', width: '100%', height: '200px',
                borderRadius: '16px', overflow: 'hidden', marginBottom: '32px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            }}>
                {/* Slide layers */}
                {config.background_images.map((img, i) => (
                    <div key={i} style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        opacity: i === previewSlide ? 1 : 0,
                        transition: 'opacity 0.8s ease',
                    }} />
                ))}
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.60)' }} />
                {/* Preview text */}
                <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                        {config.hero_title}
                        <span style={{ color: '#f97316', display: 'block' }}>{config.hero_title_highlight}</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '11px', maxWidth: '400px', marginTop: '8px', lineHeight: 1.5 }}>{config.hero_subtitle}</p>
                    {/* Slide dots */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                        {config.background_images.map((_, i) => (
                            <button key={i} onClick={() => setPreviewSlide(i)} style={{
                                width: i === previewSlide ? '20px' : '8px', height: '8px', borderRadius: '4px',
                                background: i === previewSlide ? '#f97316' : 'rgba(255,255,255,0.5)',
                                border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0,
                            }} />
                        ))}
                    </div>
                </div>
                {/* Preview badge */}
                <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
                    borderRadius: '20px', padding: '4px 12px',
                    fontSize: '11px', fontWeight: 600, color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                    <Eye size={11} /> Live Preview
                </div>
            </div>

            {/* TWO-COLUMN FIELDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <Card>
                    <CardHeader style={{ paddingBottom: '8px' }}>
                        <CardTitle style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Type size={14} color="#6366f1" /> Hero Title
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>Main text (white)</Label>
                            <Input
                                value={config.hero_title}
                                onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                                placeholder="Find Your Perfect"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>Highlight text <span style={{ color: '#f97316' }}>(orange)</span></Label>
                            <Input
                                value={config.hero_title_highlight}
                                onChange={(e) => setConfig({ ...config, hero_title_highlight: e.target.value })}
                                placeholder="College Match"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>CTA Button Label</Label>
                            <Input
                                value={config.cta_text}
                                onChange={(e) => setConfig({ ...config, cta_text: e.target.value })}
                                placeholder="Search"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader style={{ paddingBottom: '8px' }}>
                        <CardTitle style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Type size={14} color="#6366f1" /> Subtitle & Timing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>Subtitle text</Label>
                            <Textarea
                                value={config.hero_subtitle}
                                onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                                rows={4}
                                style={{ fontSize: '13px', resize: 'vertical' }}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={12} color="#6366f1" /> Slide Interval (seconds)
                            </Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Input
                                    type="number"
                                    min={2}
                                    max={30}
                                    value={config.slide_interval_ms / 1000}
                                    onChange={(e) => setConfig({ ...config, slide_interval_ms: Math.max(2000, parseFloat(e.target.value) * 1000) })}
                                    style={{ width: '80px' }}
                                />
                                <span style={{ fontSize: '12px', color: '#64748b' }}>seconds between slides</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* BACKGROUND IMAGES */}
            <Card>
                <CardHeader style={{ paddingBottom: '8px' }}>
                    <CardTitle style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Image size={14} color="#6366f1" />
                        Background Slideshow Images
                        <span style={{
                            marginLeft: '8px', fontSize: '11px', fontWeight: 500,
                            background: '#eff6ff', color: '#2563eb',
                            padding: '1px 8px', borderRadius: '20px', border: '1px solid #bfdbfe',
                        }}>
                            {config.background_images.length} images
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                        Images auto-rotate on the hero section. Drag to reorder. First image appears first.
                    </p>

                    {/* Image list */}
                    {config.background_images.length === 0 && (
                        <div style={{
                            textAlign: 'center', padding: '32px', border: '2px dashed #e2e8f0',
                            borderRadius: '10px', color: '#94a3b8', marginBottom: '14px',
                        }}>
                            No images. Add at least one below.
                        </div>
                    )}

                    {config.background_images.map((url, i) => (
                        <ImageRow
                            key={i}
                            url={url}
                            index={i}
                            total={config.background_images.length}
                            onChange={(v) => updateImage(i, v)}
                            onRemove={() => removeImage(i)}
                            onMoveUp={() => moveImage(i, -1)}
                            onMoveDown={() => moveImage(i, 1)}
                        />
                    ))}

                    {/* Add new URL */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <Input
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="Paste new image URL here…"
                            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                            style={{ flex: 1 }}
                        />
                        <Button
                            type="button"
                            onClick={addUrl}
                            disabled={!newUrl.trim()}
                            style={{ gap: '5px', background: '#6366f1', color: '#fff', whiteSpace: 'nowrap' }}
                        >
                            <Plus size={14} /> Add Image
                        </Button>
                    </div>

                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                        💡 Tip: Use Unsplash URLs like <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>https://images.unsplash.com/photo-...?w=1920&q=85</code> for best quality.
                    </p>
                </CardContent>
            </Card>

            {/* BRANDING & COLOURS */}
            <Card style={{ marginTop: '24px' }}>
                <CardHeader style={{ paddingBottom: '8px' }}>
                    <CardTitle style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🎨 Branding, Logo & Colours
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">

                    {/* Site name */}
                    <div className="space-y-1">
                        <Label style={{ fontSize: '12px' }}>Site Name (shown in header &amp; browser tab)</Label>
                        <Input
                            value={config.site_name || ''}
                            onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                            placeholder="Edu Dham"
                        />
                    </div>

                    {/* Logo upload */}
                    <div className="space-y-2">
                        <Label style={{ fontSize: '12px' }}>Logo Image (replaces the graduation-cap icon in header)</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {config.logo_url ? (
                                <img
                                    src={config.logo_url}
                                    alt="logo preview"
                                    style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                />
                            ) : (
                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1.5px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Upload size={18} color="#94a3b8" />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <LogoUploader
                                    value={config.logo_url || ''}
                                    onChange={(url) => setConfig({ ...config, logo_url: url })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colour pickers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>Hero Title Colour</Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={config.hero_title_color || '#ffffff'}
                                    onChange={(e) => setConfig({ ...config, hero_title_color: e.target.value })}
                                    style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                                />
                                <Input
                                    value={config.hero_title_color || '#ffffff'}
                                    onChange={(e) => setConfig({ ...config, hero_title_color: e.target.value })}
                                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>Highlight Colour <span style={{ color: config.hero_highlight_color || '#f97316' }}>●</span></Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={config.hero_highlight_color || '#f97316'}
                                    onChange={(e) => setConfig({ ...config, hero_highlight_color: e.target.value })}
                                    style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                                />
                                <Input
                                    value={config.hero_highlight_color || '#f97316'}
                                    onChange={(e) => setConfig({ ...config, hero_highlight_color: e.target.value })}
                                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label style={{ fontSize: '12px' }}>Subtitle Colour</Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={config.hero_subtitle_color || '#cbd5e1'}
                                    onChange={(e) => setConfig({ ...config, hero_subtitle_color: e.target.value })}
                                    style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                                />
                                <Input
                                    value={config.hero_subtitle_color || '#cbd5e1'}
                                    onChange={(e) => setConfig({ ...config, hero_subtitle_color: e.target.value })}
                                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fafbff' }}>
                        <input
                            type="checkbox"
                            id="show-footer"
                            checked={!!config.show_footer}
                            onChange={(e) => setConfig({ ...config, show_footer: e.target.checked })}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="show-footer" style={{ fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                            Show footer on homepage (copyright bar)
                        </label>
                    </div>

                </CardContent>
            </Card>

            {/* Bottom save */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} disabled={saving}
                    style={{ gap: '8px', background: '#6366f1', color: '#fff', padding: '10px 28px', fontSize: '15px' }}>
                    <Save size={16} /> {saving ? 'Saving…' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    );
};

export default HomepageEditor;
