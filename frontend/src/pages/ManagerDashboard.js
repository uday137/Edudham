import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  FileText,
  LogOut,
  Download,
  GraduationCap,
  Edit,
  Image,
  X,
  Settings2,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import { toast } from 'sonner';
import UniversityDetailsEditor from '@/components/UniversityDetailsEditor';
import CategoryMultiSelect from '@/components/CategoryMultiSelect';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useBranding } from '@/context/BrandingContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];



/* ── Photo Uploader ─────────────────────────────── */
const PhotoUploader = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB.'); return; }
    setUploading(true);
    try {
      const result = await api.uploadUniversityPhoto(file);
      onChange(result.photo_url);
      toast.success('Photo uploaded!');
    } catch {
      toast.error('Failed to upload photo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {value ? (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={value} alt="University" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }} />
            <button type="button" onClick={() => onChange('')} style={{
              position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444',
              color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}><X size={12} /></button>
          </div>
        ) : (
          <div style={{
            width: '120px', height: '80px', background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
            borderRadius: '8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
            border: '2px dashed #cbd5e1',
          }}>
            <GraduationCap size={28} />
            <span style={{ fontSize: '9px', fontWeight: 600, textAlign: 'center', marginTop: '4px' }}>Work Under<br />Progress</span>
          </div>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
            borderRadius: '8px', border: '2px dashed #94a3b8', background: '#f8fafc',
            color: '#475569', cursor: 'pointer', fontSize: '14px',
          }}>
            <Image size={16} />
            {uploading ? 'Uploading...' : value ? 'Change Photo' : 'Upload Photo'}
          </button>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Optional · Max 5MB · JPG, PNG, WEBP</p>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const { siteName, logoUrl } = useBranding();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('university');
  const [university, setUniversity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [detailsTab, setDetailsTab] = useState('basic');
  const [confirmApp, setConfirmApp] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({});
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    api.getCategories()
      .then(data => setDynamicCategories(data.map(c => c.name)))
      .catch(console.error);
    if (user?.university_id) {
      fetchUniversity();
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUniversity = async () => {
    try {
      const data = await api.getUniversity(user.university_id);
      setUniversity(data);
      setFormData({
        name: data.name,
        location: data.location,
        state: data.state || '',
        university_categories: Array.isArray(data.university_categories)
          ? data.university_categories
          : (data.university_category ? [data.university_category] : []),
        main_photo: data.main_photo || '',
        description: data.description,
        placement_percentage: data.placement_percentage,
        rating: data.rating,
      });
    } catch (error) {
      toast.error('Failed to load university');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await api.getApplicationsByUniversity(user.university_id);
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    }
  };

  const handleUpdateUniversity = async (e) => {
    e.preventDefault();
    try {
      await api.updateUniversity(user.university_id, {
        ...formData,
        placement_percentage: parseFloat(formData.placement_percentage),
        rating: parseFloat(formData.rating),
      });
      toast.success('University updated successfully!');
      fetchUniversity();
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update university');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const blob = await api.exportApplicationsExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${university.name.replace(' ', '_')}_applications_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download Excel');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">No university assigned</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-secondary">{siteName}</h1>
              <p className="text-xs text-muted-foreground">Manager Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">University Manager</p>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="logout-button">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="university" data-testid="tab-university">
              <School className="w-4 h-4 mr-2" />
              My University
            </TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-applications">
              <FileText className="w-4 h-4 mr-2" />
              Applications ({applications.length})
            </TabsTrigger>
          </TabsList>

          {/* University Tab */}
          <TabsContent value="university" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* ── Basic Info Card ── */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>University Details</CardTitle>
                    {!editMode && (
                      <Button size="sm" onClick={() => setEditMode(true)} data-testid="edit-university-button">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Basic Info
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <form onSubmit={handleUpdateUniversity} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label>University Name</Label>
                          <Input
                            data-testid="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>

                        {/* Location + State */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>City / Location</Label>
                            <Input
                              data-testid="edit-location"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} color="#6366f1" /> State
                            </Label>
                            <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                              <SelectTrigger data-testid="edit-state">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {INDIAN_STATES.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* University Categories — multi-select */}
                        <div className="space-y-2">
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🎓 University Categories
                            <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: 500, background: '#eff6ff', color: '#2563eb', padding: '1px 7px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                              Used for home page filters
                            </span>
                          </Label>
                          <CategoryMultiSelect
                            selected={formData.university_categories || []}
                            onChange={(cats) => setFormData({ ...formData, university_categories: cats })}
                            options={dynamicCategories}
                            placeholder="Select one or more categories…"
                            testId="edit-category"
                          />
                        </div>

                        {/* Photo */}
                        <div className="space-y-2">
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Image size={13} color="#6366f1" /> Main Photo
                            <span style={{ marginLeft: '6px', fontSize: '10px', background: '#f0fdf4', color: '#15803d', padding: '1px 7px', borderRadius: '20px', border: '1px solid #86efac' }}>Optional</span>
                          </Label>
                          <PhotoUploader value={formData.main_photo} onChange={(url) => setFormData({ ...formData, main_photo: url })} />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            data-testid="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            required
                          />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Placement %</Label>
                            <Input
                              data-testid="edit-placement"
                              type="number" step="0.1" min="0" max="100"
                              value={formData.placement_percentage}
                              onChange={(e) => setFormData({ ...formData, placement_percentage: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Rating (0–5)</Label>
                            <Input
                              data-testid="edit-rating"
                              type="number" step="0.1" min="0" max="5"
                              value={formData.rating}
                              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditMode(false);
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
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" data-testid="save-university-button">Save Changes</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-secondary mb-1" data-testid="uni-display-name">
                            {university.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {university.location}{university.state ? `, ${university.state}` : ''}
                          </p>
                          {/* Category chips */}
                          {((university.university_categories?.length > 0) || university.university_category) && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                              {(university.university_categories?.length > 0
                                ? university.university_categories
                                : [university.university_category]
                              ).map((cat) => (
                                <span key={cat} style={{
                                  fontSize: '12px', fontWeight: 600,
                                  background: '#dbeafe', color: '#1d4ed8',
                                  padding: '2px 10px', borderRadius: '20px',
                                }}>
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Photo */}
                        <div className="aspect-video overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                          {university.main_photo ? (
                            <img src={university.main_photo} alt={university.name} className="w-full h-full object-cover" />
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8' }}>
                              <GraduationCap size={64} />
                              <span style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>Work Under Progress</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-muted-foreground">{university.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-accent/10 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Placement Rate</div>
                            <div className="text-2xl font-bold text-accent">{university.placement_percentage}%</div>
                          </div>
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Rating</div>
                            <div className="text-2xl font-bold text-primary">{university.rating}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Extended Details Editor ── */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '16px', padding: '12px 16px',
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)',
                    border: '1.5px solid #e0e7ff', borderRadius: '10px',
                  }}>
                    <Settings2 size={18} color="#6366f1" />
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                        Extended University Details
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        Manage courses, fee structure, photo gallery, tags & contact info
                      </p>
                    </div>
                  </div>
                  <UniversityDetailsEditor
                    universityId={university.id}
                    initialData={university}
                    onSaved={() => fetchUniversity()}
                    categories={dynamicCategories}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-100 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total Applications</div>
                      <div className="text-3xl font-bold text-secondary">{applications.length}</div>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Pending</div>
                      <div className="text-3xl font-bold text-orange-500">
                        {applications.filter((a) => a.status === 'pending').length}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Courses Offered</div>
                      <div className="text-3xl font-bold text-primary">{university.courses?.length || 0}</div>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Gallery Photos</div>
                      <div className="text-3xl font-bold text-secondary">{university.photo_gallery?.length || 0}</div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleDownloadExcel}
                      data-testid="download-excel-button"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Excel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Applications ({applications.length})</CardTitle>
                <Button onClick={handleDownloadExcel} data-testid="download-excel-button-2">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications received yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Course Interest</TableHead>
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
                          <TableCell>{app.course_interest}</TableCell>
                          <TableCell>
                            <Select
                              value={app.status}
                              onValueChange={(value) => {
                                api.updateApplicationStatus(app.id, value).then(() => {
                                  toast.success('Status updated');
                                  fetchApplications();
                                }).catch(() => toast.error('Failed to update status'));
                              }}
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagerDashboard;
