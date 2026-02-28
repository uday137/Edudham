import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  School,
  FileText,
  Users,
  LogOut,
  Plus,
  Download,
  GraduationCap,
  Upload,
  FileSpreadsheet,
  Image,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  Settings2,
  Layout,
  Tags,
  Pencil,
  Trash2,
} from 'lucide-react';
import UniversityDetailsEditor from '@/components/UniversityDetailsEditor';
import HomepageEditor from '@/components/HomepageEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import { toast } from 'sonner';
import CategoryMultiSelect from '@/components/CategoryMultiSelect';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useBranding } from '@/context/BrandingContext';

// Indian states list
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Indian states list (no change) ...

// Placeholder image component for universities with no photo
const PlaceholderImage = ({ size = 'md' }) => {
  const sizes = {
    sm: { container: '48px', icon: '24px', text: '9px' },
    md: { container: '80px', icon: '36px', text: '10px' },
    lg: { container: '200px', icon: '64px', text: '13px' },
  };
  const s = sizes[size];
  return (
    <div
      style={{
        width: s.container,
        height: s.container,
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        borderRadius: size === 'sm' ? '6px' : '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        border: '2px dashed #cbd5e1',
        flexShrink: 0,
      }}
    >
      <GraduationCap style={{ width: s.icon, height: s.icon, marginBottom: '4px' }} />
      <span style={{ fontSize: s.text, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
        Work Under<br />Progress
      </span>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { siteName, logoUrl } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'overview';
    setActiveTab(path);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'universities', label: 'Universities', icon: School },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'homepage', label: 'Homepage', icon: Layout },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg">{siteName}</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={`/admin/${item.id === 'overview' ? '' : item.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-slate-100'
                  }`}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<OverviewTab />} />
          <Route path="/overview" element={<OverviewTab />} />
          <Route path="/universities" element={<UniversitiesTab />} />
          <Route path="/applications" element={<ApplicationsTab />} />
          <Route path="/users" element={<UsersTab />} />
          <Route path="/categories" element={<CategoriesTab />} />
          <Route path="/homepage" element={<HomepageEditor />} />
        </Routes>
      </main>
    </div>
  );
};

// Overview Tab
const OverviewTab = () => {
  const [stats, setStats] = useState({
    total_universities: 0,
    total_applications: 0,
    total_managers: 0,
    pending_applications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Universities', value: stats.total_universities, icon: School, color: 'bg-primary' },
    { title: 'Total Applications', value: stats.total_applications, icon: FileText, color: 'bg-accent' },
    { title: 'University Managers', value: stats.total_managers, icon: Users, color: 'bg-primary' },
    { title: 'Pending Applications', value: stats.pending_applications, icon: FileText, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to Edu Dham admin panel</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="stat-card" data-testid={`stat-${idx}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Photo Upload Component ──────────────────────────────────────────────────
const PhotoUploader = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const result = await api.uploadUniversityPhoto(file);
      onChange(result.photo_url);
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error('Failed to upload photo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Preview */}
        {value ? (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={value}
              alt="University"
              style={{
                width: '96px', height: '72px',
                objectFit: 'cover', borderRadius: '8px',
                border: '2px solid #e2e8f0',
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#ef4444', color: '#fff', border: 'none',
                borderRadius: '50%', width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '12px',
              }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <PlaceholderImage size="md" />
        )}

        {/* Upload button area */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px',
              border: '2px dashed #94a3b8',
              background: uploading ? '#f1f5f9' : '#f8fafc',
              color: '#475569', cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            <Image size={16} />
            {uploading ? 'Uploading...' : value ? 'Change Photo' : 'Upload Photo'}
          </button>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Optional · Max 5 MB · JPG, PNG, WEBP. If no photo, a placeholder will be shown.
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Bulk Upload Section ─────────────────────────────────────────────────────
const BulkUploadSection = ({ onSuccess }) => {
  const bulkFileRef = useRef(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const handleDownloadTemplate = async () => {
    try {
      const blob = await api.downloadBulkTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'university_bulk_upload_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded!');
    } catch (err) {
      toast.error('Failed to download template.');
    }
  };

  const handleBulkFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkUploading(true);
    setBulkResult(null);
    try {
      const result = await api.bulkUploadUniversities(file);
      setBulkResult(result);
      if (result.created_count > 0) {
        toast.success(`${result.created_count} universities uploaded successfully!`);
        onSuccess();
      } else {
        toast.warning('No universities were created. Check errors below.');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Bulk upload failed.');
    } finally {
      setBulkUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Card style={{ marginBottom: '24px', border: '2px solid #e0e7ff', background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)' }}>
      <CardHeader style={{ paddingBottom: '12px' }}>
        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', color: '#1e3a5f' }}>
          <FileSpreadsheet size={20} color="#3b82f6" />
          Bulk Upload Universities via Excel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          {/* Step 1 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#fff', border: '1.5px solid #dbeafe', borderRadius: '10px',
            padding: '12px 18px', flex: '1 1 220px',
          }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#2563eb', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '14px', flexShrink: 0,
            }}>1</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '13px', color: '#1e40af' }}>Download Sample Template</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Get the Excel format with instructions</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadTemplate}
              style={{ marginLeft: 'auto', borderColor: '#2563eb', color: '#2563eb', flexShrink: 0 }}
              data-testid="download-template-btn"
            >
              <Download size={14} style={{ marginRight: '4px' }} />
              Download
            </Button>
          </div>

          {/* Step 2 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#fff', border: '1.5px solid #d1fae5', borderRadius: '10px',
            padding: '12px 18px', flex: '1 1 220px',
          }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#16a34a', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '14px', flexShrink: 0,
            }}>2</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '13px', color: '#15803d' }}>Fill & Upload Excel</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Fill in university details, upload here</p>
            </div>
            <div>
              <input
                ref={bulkFileRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleBulkFile}
              />
              <Button
                size="sm"
                onClick={() => bulkFileRef.current?.click()}
                disabled={bulkUploading}
                style={{ marginLeft: '8px', background: '#16a34a', color: '#fff', flexShrink: 0 }}
                data-testid="bulk-upload-btn"
              >
                <Upload size={14} style={{ marginRight: '4px' }} />
                {bulkUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </div>
          </div>
        </div>

        {/* Result panel */}
        {bulkResult && (
          <div style={{
            background: '#fff', border: `1.5px solid ${bulkResult.error_count > 0 ? '#fde68a' : '#bbf7d0'}`,
            borderRadius: '10px', padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <span style={{ fontWeight: 600, color: '#15803d', fontSize: '14px' }}>
                {bulkResult.created_count} university/ies created successfully
              </span>
            </div>
            {bulkResult.created_count > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Created:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {bulkResult.created.map((name, i) => (
                    <span key={i} style={{
                      background: '#d1fae5', color: '#065f46', padding: '2px 8px',
                      borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                    }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {bulkResult.error_count > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <AlertCircle size={16} color="#d97706" />
                  <span style={{ fontWeight: 600, color: '#92400e', fontSize: '13px' }}>
                    {bulkResult.error_count} row(s) had errors:
                  </span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {bulkResult.errors.map((err, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#7c2d12', marginBottom: '2px' }}>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', fontStyle: 'italic' }}>
          💡 Tip: Photos can be uploaded individually after bulk import using the Edit button.
        </p>
      </CardContent>
    </Card>
  );
};

// Universities Tab
const UniversitiesTab = () => {
  const [universities, setUniversities] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic categories
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [expandedDetailsId, setExpandedDetailsId] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    state: '',
    university_categories: [],
    main_photo: '',
    description: '',
    placement_percentage: '',
    rating: '',
  });

  useEffect(() => {
    fetchUniversities();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.map(c => c.name));
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const data = await api.getUniversities();
      setUniversities(data);
    } catch (error) {
      toast.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', state: '', university_categories: [], main_photo: '', description: '', placement_percentage: '', rating: '' });
    setShowAddForm(false);
    setEditingUniversity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        placement_percentage: parseFloat(formData.placement_percentage),
        rating: parseFloat(formData.rating) || 0,
      };

      if (editingUniversity) {
        await api.updateUniversity(editingUniversity.id, payload);
        toast.success('University updated successfully!');
      } else {
        await api.createUniversity({
          ...payload,
          photo_gallery: [],
          courses: [],
          tags: [],
          contact_details: {},
        });
        toast.success('University added successfully!');
      }
      fetchUniversities();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save university');
    }
  };

  const handleEdit = (university) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name,
      location: university.location,
      state: university.state || '',
      university_categories: Array.isArray(university.university_categories)
        ? university.university_categories
        : (university.university_category ? [university.university_category] : []),
      main_photo: university.main_photo || '',
      description: university.description,
      placement_percentage: university.placement_percentage,
      rating: university.rating,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (universityId) => {
    setConfirmState({ open: true, id: universityId });
  };

  const doDelete = async () => {
    const universityId = confirmState.id;
    setConfirmState({ open: false, id: null });
    try {
      await api.deleteUniversity(universityId);
      toast.success('University deleted successfully!');
      fetchUniversities();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete university');
    }
  };

  const handleDownloadExcel = async (universityId, universityName) => {
    try {
      const blob = await api.exportUniversityApplicationsExcel(universityId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${universityName.replace(' ', '_')}_applications_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download Excel');
    }
  };

  return (
    <div>
      <ConfirmDialog
        open={confirmState.open}
        title="Delete University"
        message="Are you sure you want to delete this university? This action cannot be undone."
        onConfirm={doDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Universities</h1>
          <p className="text-muted-foreground">Manage all universities</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingUniversity(null);
            setFormData({ name: '', location: '', state: '', university_categories: [], main_photo: '', description: '', placement_percentage: '', rating: '' });
          }}
          data-testid="add-university-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add University
        </Button>
      </div>

      {/* Bulk Upload Section */}

      <BulkUploadSection onSuccess={fetchUniversities} />

      {/* Add / Edit Form */}
      {
        showAddForm && (
          <Card className="mb-6" style={{ border: '2px solid #e2e8f0' }}>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editingUniversity ? '✏️ Edit University' : '🏫 Add New University'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                {/* University Name */}
                <div className="space-y-2">
                  <Label>University Name *</Label>
                  <Input
                    data-testid="uni-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Integral University"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>City / Location *</Label>
                  <Input
                    data-testid="uni-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Lucknow"
                    required
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#6366f1" />
                    State *
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={(v) => setFormData({ ...formData, state: v })}
                  >
                    <SelectTrigger data-testid="uni-state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* University Categories — multi-select */}
                <div className="col-span-2 space-y-2">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500 }}>
                    🎓 University Categories
                    <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: 500, background: '#eff6ff', color: '#2563eb', padding: '1px 7px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                      Used for filters
                    </span>
                  </label>
                  <CategoryMultiSelect
                    selected={formData.university_categories || []}
                    onChange={(cats) => setFormData({ ...formData, university_categories: cats })}
                    options={categories}
                    placeholder="Select one or more categories…"
                    testId="uni-category"
                  />
                </div>

                {/* Placement */}
                <div className="space-y-2">
                  <Label>Placement % *</Label>
                  <Input
                    data-testid="uni-placement"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.placement_percentage}
                    onChange={(e) => setFormData({ ...formData, placement_percentage: e.target.value })}
                    required
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating (0–5)</Label>
                  <Input
                    data-testid="uni-rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="e.g., 4.2"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 col-span-2">
                  <Label>Description *</Label>
                  <Textarea
                    data-testid="uni-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                    placeholder="Brief description of the university..."
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2 col-span-2">
                  <Label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Image size={13} color="#6366f1" />
                    University Photo
                    <span style={{
                      marginLeft: '6px', fontSize: '10px', fontWeight: 500,
                      background: '#f0fdf4', color: '#15803d', padding: '1px 7px',
                      borderRadius: '20px', border: '1px solid #86efac',
                    }}>
                      Optional
                    </span>
                  </Label>
                  <PhotoUploader
                    value={formData.main_photo}
                    onChange={(url) => setFormData({ ...formData, main_photo: url })}
                  />
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="submit-university">
                    {editingUniversity ? 'Update University' : 'Add University'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )
      }

      {/* Universities Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Universities ({universities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : universities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No universities found. Add one or use bulk upload above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Placement %</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Extended</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((uni) => (
                  <React.Fragment key={uni.id}>
                    <TableRow data-testid={`uni-row-${uni.id}`}>
                      <TableCell>
                        {uni.main_photo ? (
                          <img
                            src={uni.main_photo}
                            alt={uni.name}
                            style={{
                              width: '48px', height: '36px', objectFit: 'cover',
                              borderRadius: '6px', border: '1px solid #e2e8f0',
                            }}
                          />
                        ) : (
                          <PlaceholderImage size="sm" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{uni.name}</TableCell>
                      <TableCell>{uni.location}</TableCell>
                      <TableCell>
                        {uni.state ? (
                          <span style={{
                            fontSize: '12px', fontWeight: 500,
                            background: '#ede9fe', color: '#6d28d9',
                            padding: '2px 8px', borderRadius: '20px',
                          }}>
                            {uni.state}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {(uni.university_categories?.length > 0 || uni.university_category) ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {(uni.university_categories?.length > 0
                              ? uni.university_categories
                              : [uni.university_category]
                            ).map((cat) => (
                              <span key={cat} style={{
                                fontSize: '11px', fontWeight: 600,
                                background: '#dbeafe', color: '#1d4ed8',
                                padding: '2px 7px', borderRadius: '20px',
                                whiteSpace: 'nowrap',
                              }}>
                                {cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                        )}
                      </TableCell>
                      <TableCell>⭐ {uni.rating}</TableCell>
                      <TableCell>{uni.placement_percentage}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(uni)} data-testid={`edit-uni-${uni.id}`}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadExcel(uni.id, uni.name)} data-testid={`download-uni-${uni.id}`}>
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(uni.id)} data-testid={`delete-uni-${uni.id}`}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={expandedDetailsId === uni.id ? 'default' : 'outline'}
                          onClick={() => setExpandedDetailsId(expandedDetailsId === uni.id ? null : uni.id)}
                          style={{ gap: '5px', whiteSpace: 'nowrap' }}
                          data-testid={`details-uni-${uni.id}`}
                        >
                          <Settings2 size={13} />
                          Details
                          {expandedDetailsId === uni.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedDetailsId === uni.id && (
                      <tr>
                        <td colSpan={8} style={{ padding: 0 }}>
                          <div style={{
                            background: '#f8faff',
                            borderTop: '2px solid #e0e7ff',
                            padding: '24px 28px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                              <Settings2 size={18} color="#6366f1" />
                              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                Extended Details — {uni.name}
                              </h3>
                            </div>
                            <UniversityDetailsEditor
                              universityId={uni.id}
                              initialData={uni}
                              onSaved={() => fetchUniversities()}
                              categories={categories}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div >
  );
};

// Applications Tab
const ApplicationsTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmApp, setConfirmApp] = useState({ open: false, id: null });

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const blob = await api.exportApplicationsExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_applications_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download Excel');
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      toast.success('Status updated successfully!');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <ConfirmDialog
        open={confirmApp.open}
        title="Delete Application"
        message="Are you sure you want to delete this application?"
        onConfirm={() => {
          const id = confirmApp.id;
          setConfirmApp({ open: false, id: null });
          api.deleteApplication(id).then(() => {
            toast.success('Application deleted');
            fetchApplications();
          }).catch(() => toast.error('Failed to delete'));
        }}
        onCancel={() => setConfirmApp({ open: false, id: null })}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Applications</h1>
          <p className="text-muted-foreground">All university applications</p>
        </div>
        <Button onClick={handleDownloadExcel} data-testid="download-excel-button">
          <Download className="w-4 h-4 mr-2" />
          Download Excel
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No applications yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} data-testid={`app-row-${app.id}`}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{app.university_name}</TableCell>
                    <TableCell>{app.course_interest}</TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                      >
                        <SelectTrigger className="w-32" data-testid={`status-${app.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmApp({ open: true, id: app.id })}
                        data-testid={`delete-app-${app.id}`}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Users Tab
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'manager', university_id: '',
  });

  useEffect(() => { fetchUsers(); fetchUniversities(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data.filter(u => u.role === 'manager'));
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const data = await api.getUniversities();
      setUniversities(data);
    } catch (error) {
      console.error('Failed to load universities');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { name: formData.name, email: formData.email, university_id: formData.university_id };
        if (formData.password) updateData.password = formData.password;
        await api.updateUser(editingUser.id, updateData);
        toast.success('Manager updated successfully!');
      } else {
        await api.createUser(formData);
        toast.success('Manager added successfully!');
      }
      fetchUsers();
      setShowAddForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'manager', university_id: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save manager');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: 'manager', university_id: user.university_id || '' });
    setShowAddForm(true);
  };

  const handleDelete = async (userId) => {
    setConfirmUser({ open: true, id: userId });
  };

  const doDeleteUser = async () => {
    const userId = confirmUser.id;
    setConfirmUser({ open: false, id: null });
    try {
      await api.deleteUser(userId);
      toast.success('Manager deleted successfully!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete manager');
    }
  };

  return (
    <div>
      <ConfirmDialog
        open={confirmUser.open}
        title="Delete Manager"
        message="Are you sure you want to delete this manager account?"
        onConfirm={doDeleteUser}
        onCancel={() => setConfirmUser({ open: false, id: null })}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">University Managers</h1>
          <p className="text-muted-foreground">Manage university manager accounts</p>
        </div>
        <Button
          onClick={() => { setShowAddForm(!showAddForm); setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'manager', university_id: '' }); }}
          data-testid="add-manager-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Manager
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingUser ? 'Edit Manager' : 'Add University Manager'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input data-testid="manager-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input data-testid="manager-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Password {editingUser && '(leave blank to keep current)'}</Label>
                <Input data-testid="manager-password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
              </div>
              <div className="space-y-2">
                <Label>Assign University *</Label>
                <Select value={formData.university_id} onValueChange={(v) => setFormData({ ...formData, university_id: v })}>
                  <SelectTrigger data-testid="manager-university">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingUser(null); }}>Cancel</Button>
                <Button type="submit" data-testid="submit-manager">{editingUser ? 'Update' : 'Submit'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Managers ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No managers found. Add one to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const uni = universities.find(u => u.id === user.university_id);
                  return (
                    <TableRow key={user.id} data-testid={`manager-row-${user.id}`}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{uni?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(user)} data-testid={`edit-user-${user.id}`}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)} data-testid={`delete-user-${user.id}`}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Categories Tab
const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [confirmCat, setConfirmCat] = useState({ open: false, id: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { name });
        toast.success('Category updated!');
      } else {
        await api.createCategory({ name });
        toast.success('Category created!');
      }
      setName('');
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setConfirmCat({ open: true, id });
  };

  const doDeleteCat = async () => {
    const id = confirmCat.id;
    setConfirmCat({ open: false, id: null });
    try {
      await api.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div>
      <ConfirmDialog
        open={confirmCat.open}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={doDeleteCat}
        onCancel={() => setConfirmCat({ open: false, id: null })}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Categories</h1>
          <p className="text-muted-foreground">Manage dynamic university categories</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingCategory(null); setName(''); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>{new Date(cat.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(cat)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(cat.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
