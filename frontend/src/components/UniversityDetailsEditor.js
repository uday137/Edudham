import React, { useState, useRef, useEffect } from 'react';
import {
    Plus, Trash2, Upload, X, GraduationCap, DollarSign,
    Images, Tag, Phone, ChevronDown, ChevronUp, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { toast } from 'sonner';

/* ─────────────────────────────────────────────
   Section wrapper with collapsible header
   ───────────────────────────────────────────── */
const Section = ({ icon: Icon, title, color = '#6366f1', children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card style={{ marginBottom: '16px', border: `1.5px solid ${color}22` }}>
            <CardHeader
                style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    background: `${color}08`,
                    borderRadius: open ? '8px 8px 0 0' : '8px',
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'space-between',
                }}
                onClick={() => setOpen(o => !o)}
            >
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#1e293b' }}>
                    <Icon size={18} color={color} />
                    {title}
                </CardTitle>
                {open ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
            </CardHeader>
            {open && <CardContent style={{ padding: '18px 20px' }}>{children}</CardContent>}
        </Card>
    );
};

/* ─────────────────────────────────────────────
   CUSTOM CATEGORY DROPDOWN (Safari-safe)
   ───────────────────────────────────────────── */
const CategoryDropdown = ({ value, onChange, categoryNames }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = value || '';
    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', height: '36px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', padding: '0 10px',
                    fontSize: '13px', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', textAlign: 'left',
                    color: selected ? '#1e293b' : '#94a3b8',
                }}
            >
                <span>{selected || 'Select a category...'}</span>
                <ChevronDown size={14} color="#64748b" />
            </button>
            {open && (
                <div style={{
                    position: 'absolute', top: '38px', left: 0, right: 0,
                    background: '#fff', border: '1px solid #cbd5e1',
                    borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    zIndex: 9999, maxHeight: '200px', overflowY: 'auto',
                }}>
                    <button
                        type="button"
                        onClick={() => { onChange(''); setOpen(false); }}
                        style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '8px 12px', border: 'none', background: selected === '' ? '#eff6ff' : '#fff',
                            cursor: 'pointer', fontSize: '13px', color: '#94a3b8',
                        }}
                    >
                        Select a category...
                    </button>
                    {categoryNames.length === 0 && (
                        <div style={{ padding: '8px 12px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                            No categories yet — add them in the Categories tab
                        </div>
                    )}
                    {categoryNames.map((name, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => { onChange(name); setOpen(false); }}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '8px 12px', border: 'none',
                                background: selected === name ? '#eff6ff' : '#fff',
                                cursor: 'pointer', fontSize: '13px',
                                color: selected === name ? '#4338ca' : '#1e293b',
                                fontWeight: selected === name ? 600 : 400,
                            }}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   COURSES & FEES EDITOR
   ───────────────────────────────────────────── */
const CoursesEditor = ({ courses, onChange, categoryNames = [] }) => {

    const addCourse = () => {
        onChange([...courses, { course_name: '', description: '', duration: '', fees: '', category: '' }]);
    };

    const removeCourse = (idx) => {
        onChange(courses.filter((_, i) => i !== idx));
    };

    const updateCourse = (idx, field, value) => {
        const updated = [...courses];
        updated[idx] = { ...updated[idx], [field]: value };
        onChange(updated);
    };

    return (
        <Section icon={GraduationCap} title="Courses & Fees" color="#6366f1">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {courses.map((course, idx) => (
                    <div key={idx} style={{
                        background: '#f8faff', border: '1.5px solid #e0e7ff',
                        borderRadius: '10px', padding: '14px 16px',
                        display: 'flex', flexDirection: 'column', gap: '12px'
                    }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: '#6366f1', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: 700, flexShrink: 0,
                            }}>{idx + 1}</div>
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <Label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Course Name</Label>
                                    <Input
                                        value={course.course_name}
                                        onChange={(e) => updateCourse(idx, 'course_name', e.target.value)}
                                        placeholder="e.g., B.Tech"
                                        style={{ fontSize: '13px', fontWeight: 600 }}
                                    />
                                </div>
                                <div>
                                    <Label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Category (Required)</Label>
                                    <CategoryDropdown
                                        value={course.category}
                                        onChange={(val) => updateCourse(idx, 'category', val)}
                                        categoryNames={categoryNames}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeCourse(idx)}
                                style={{
                                    background: '#fee2e2', color: '#dc2626', border: 'none',
                                    borderRadius: '6px', padding: '6px 10px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', alignSelf: 'flex-end',
                                    height: '36px'
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <Label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Duration</Label>
                                <Input
                                    value={course.duration}
                                    onChange={(e) => updateCourse(idx, 'duration', e.target.value)}
                                    placeholder="e.g., 4 Years"
                                    style={{ fontSize: '13px' }}
                                />
                            </div>
                            <div>
                                <Label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Annual Fees (₹)</Label>
                                <Input
                                    type="number"
                                    value={course.fees}
                                    onChange={(e) => updateCourse(idx, 'fees', e.target.value)}
                                    placeholder="e.g., 120000"
                                    style={{ fontSize: '13px' }}
                                />
                            </div>
                        </div>
                        <div>
                            <Label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Description</Label>
                            <Textarea
                                value={course.description}
                                onChange={(e) => updateCourse(idx, 'description', e.target.value)}
                                placeholder="Short description..."
                                rows={2}
                                style={{ fontSize: '13px', color: '#475569', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addCourse} style={{ borderStyle: 'dashed', color: '#6366f1', borderColor: '#6366f1' }}>
                    <Plus size={15} style={{ marginRight: '6px' }} />
                    Add Course
                </Button>
            </div>
        </Section>
    );
};

/* ─────────────────────────────────────────────
   PHOTO GALLERY EDITOR
   ───────────────────────────────────────────── */
const PhotoGalleryEditor = ({ gallery, onChange }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        const newPhotos = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image.`); continue; }
            if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB.`); continue; }
            try {
                const result = await api.uploadUniversityPhoto(file);
                newPhotos.push(result.photo_url);
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            }
        }
        if (newPhotos.length) {
            onChange([...gallery, ...newPhotos]);
            toast.success(`${newPhotos.length} photo(s) added to gallery!`);
        }
        setUploading(false);
        e.target.value = '';
    };

    const removePhoto = (idx) => {
        onChange(gallery.filter((_, i) => i !== idx));
    };

    return (
        <Section icon={Images} title="Photo Gallery" color="#f59e0b">
            <div>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    {gallery.map((photo, idx) => (
                        <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/10', border: '2px solid #fde68a' }}>
                            <img src={photo} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                type="button"
                                onClick={() => removePhoto(idx)}
                                style={{
                                    position: 'absolute', top: '4px', right: '4px',
                                    background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none',
                                    borderRadius: '50%', width: '22px', height: '22px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {/* Upload tile */}
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        style={{
                            aspectRatio: '16/10', border: '2px dashed #f59e0b',
                            borderRadius: '8px', background: '#fffbeb',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: '6px', cursor: 'pointer',
                            color: '#d97706', fontSize: '12px', fontWeight: 600,
                        }}
                    >
                        <Upload size={20} />
                        {uploading ? 'Uploading...' : 'Add Photos'}
                    </button>
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Select multiple images at once · Max 5MB each · JPG, PNG, WEBP
                </p>
            </div>
        </Section>
    );
};

/* ─────────────────────────────────────────────
   TAGS EDITOR
   ───────────────────────────────────────────── */
const TagsEditor = ({ tags, onChange }) => {
    const [input, setInput] = useState('');

    const addTag = (e) => {
        e.preventDefault();
        const val = input.trim();
        if (!val) return;
        if (!tags.includes(val)) onChange([...tags, val]);
        setInput('');
    };

    const removeTag = (idx) => onChange(tags.filter((_, i) => i !== idx));

    return (
        <Section icon={Tag} title="Tags" color="#0ea5e9" defaultOpen={false}>
            <div>
                <form onSubmit={addTag} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add a tag (e.g., Engineering, MBA, Research)..."
                        style={{ flex: 1, fontSize: '13px' }}
                    />
                    <Button type="submit" size="sm" variant="outline" style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                        <Plus size={14} />
                    </Button>
                </form>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tags.map((tag, idx) => (
                        <span key={idx} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#e0f2fe', color: '#0369a1',
                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                        }}>
                            {tag}
                            <button type="button" onClick={() => removeTag(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0369a1', display: 'flex' }}>
                                <X size={11} />
                            </button>
                        </span>
                    ))}
                    {tags.length === 0 && <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No tags yet. Tags help students find this university.</span>}
                </div>
            </div>
        </Section>
    );
};

/* ─────────────────────────────────────────────
   CONTACT DETAILS EDITOR
   ───────────────────────────────────────────── */
const ContactEditor = ({ contact, onChange }) => {
    const update = (key, value) => onChange({ ...contact, [key]: value });

    return (
        <Section icon={Phone} title="Contact Details" color="#ec4899" defaultOpen={false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                    <Label style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>📧 Email</Label>
                    <Input value={contact.email || ''} onChange={(e) => update('email', e.target.value)} placeholder="info@university.edu.in" style={{ fontSize: '13px' }} />
                </div>
                <div>
                    <Label style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>📞 Phone</Label>
                    <Input value={contact.phone || ''} onChange={(e) => update('phone', e.target.value)} placeholder="+91-XXXXXXXXXX" style={{ fontSize: '13px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Label style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>🌐 Website</Label>
                    <Input value={contact.website || ''} onChange={(e) => update('website', e.target.value)} placeholder="https://www.university.edu.in" style={{ fontSize: '13px' }} />
                </div>
                <div>
                    <Label style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>📍 Address</Label>
                    <Input value={contact.address || ''} onChange={(e) => update('address', e.target.value)} placeholder="Full address..." style={{ fontSize: '13px' }} />
                </div>
            </div>
        </Section>
    );
};

/* ─────────────────────────────────────────────
   MAIN EXPORTED COMPONENT
   ───────────────────────────────────────────── */
const UniversityDetailsEditor = ({
    universityId,
    initialData = {},
    onSaved,
    includeBasicSave = false,
    categories: categoriesProp = null, // pre-loaded categories from parent (Safari fix)
}) => {
    const [categoryNames, setCategoryNames] = useState(
        // Use prop immediately if available — avoids async render in Safari
        Array.isArray(categoriesProp) ? categoriesProp.map(c => String(typeof c === 'object' ? c.name : c)).filter(Boolean) : []
    );
    const [courses, setCourses] = useState(
        Array.isArray(initialData.courses) ? initialData.courses : []
    );
    const [gallery, setGallery] = useState(initialData.photo_gallery || []);
    const [tags, setTags] = useState(initialData.tags || []);
    const [universityCategories, setUniversityCategories] = useState(initialData.university_categories || []);
    const [contact, setContact] = useState(initialData.contact_details || {});
    const [saving, setSaving] = useState(false);

    // Fallback: fetch categories if parent didn't supply them
    useEffect(() => {
        if (categoriesProp !== null) return; // already have them from prop
        api.getCategories()
            .then(data => setCategoryNames(data.map(c => String(c.name || '')).filter(Boolean)))
            .catch(console.error);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const buildPayload = () => {
        const payloadTags = new Set(tags);
        const payloadUniCategories = new Set(universityCategories);

        // Remove old auto-added categories from the sets
        const oldCourseCategories = new Set(
            (initialData.courses || [])
                .map(c => c.category?.trim())
                .filter(Boolean)
        );
        oldCourseCategories.forEach(cat => {
            payloadTags.delete(cat);
            payloadUniCategories.delete(cat);
        });
        const coursesPayload = courses
            .filter(c => Object.values(c).some(val => val && val.toString().trim() !== ''))
            .map(c => {
                const category = c.category?.trim() || '';
                if (category) {
                    payloadTags.add(category);
                    payloadUniCategories.add(category);
                }
                return {
                    course_name: c.course_name?.trim() || '',
                    description: c.description?.trim() || '',
                    duration: c.duration?.trim() || '',
                    fees: parseFloat(c.fees) || 0,
                    category: category
                };
            });

        return {
            courses: coursesPayload,
            photo_gallery: gallery,
            tags: Array.from(payloadTags),
            university_categories: Array.from(payloadUniCategories),
            contact_details: contact,
        };
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateUniversity(universityId, buildPayload());
            toast.success('University details saved successfully!');
            onSaved && onSaved(buildPayload());
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to save details.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <CoursesEditor
                courses={courses}
                onChange={setCourses}
                categoryNames={categoryNames}
            />
            <PhotoGalleryEditor gallery={gallery} onChange={setGallery} />
            <TagsEditor tags={tags} onChange={setTags} />
            <ContactEditor contact={contact} onChange={setContact} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button onClick={handleSave} disabled={saving} style={{ minWidth: '220px', gap: '8px' }}>
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Extended Details'}
                </Button>
            </div>
        </div>
    );
};

export default UniversityDetailsEditor;
