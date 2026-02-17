import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const AdminDashboard = () => {
  const { user, logout } = useAuth();
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
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Edu Dham</h2>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
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
    {
      title: 'Total Universities',
      value: stats.total_universities,
      icon: School,
      color: 'bg-primary',
    },
    {
      title: 'Total Applications',
      value: stats.total_applications,
      icon: FileText,
      color: 'bg-accent',
    },
    {
      title: 'University Managers',
      value: stats.total_managers,
      icon: Users,
      color: 'bg-primary',
    },
    {
      title: 'Pending Applications',
      value: stats.pending_applications,
      icon: FileText,
      color: 'bg-orange-500',
    },
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

// Universities Tab
const UniversitiesTab = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    main_photo: '',
    description: '',
    placement_percentage: '',
    rating: '',
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const data = await api.getUniversities();
      setUniversities(data);
    } catch (error) {
      toast.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUniversity) {
        await api.updateUniversity(editingUniversity.id, {
          ...formData,
          placement_percentage: parseFloat(formData.placement_percentage),
          rating: parseFloat(formData.rating),
        });
        toast.success('University updated successfully!');
      } else {
        await api.createUniversity({
          ...formData,
          placement_percentage: parseFloat(formData.placement_percentage),
          rating: parseFloat(formData.rating),
          photo_gallery: [],
          courses_offered: [],
          course_descriptions: [],
          fee_structure: [],
          tags: [],
          contact_details: {},
        });
        toast.success('University added successfully!');
      }
      fetchUniversities();
      setShowAddForm(false);
      setEditingUniversity(null);
      setFormData({
        name: '',
        location: '',
        main_photo: '',
        description: '',
        placement_percentage: '',
        rating: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save university');
    }
  };

  const handleEdit = (university) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name,
      location: university.location,
      main_photo: university.main_photo,
      description: university.description,
      placement_percentage: university.placement_percentage,
      rating: university.rating,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (universityId) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Universities</h1>
          <p className="text-muted-foreground">Manage all universities</p>
        </div>
        <Button onClick={() => { setShowAddForm(!showAddForm); setEditingUniversity(null); setFormData({ name: '', location: '', main_photo: '', description: '', placement_percentage: '', rating: '' }); }} data-testid="add-university-button">
          <Plus className="w-4 h-4 mr-2" />
          Add University
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingUniversity ? 'Edit University' : 'Add New University'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>University Name *</Label>
                <Input
                  data-testid="uni-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  data-testid="uni-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Main Photo URL *</Label>
                <Input
                  data-testid="uni-photo"
                  value={formData.main_photo}
                  onChange={(e) => setFormData({ ...formData, main_photo: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Description *</Label>
                <Textarea
                  data-testid="uni-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

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

              <div className="space-y-2">
                <Label>Rating *</Label>
                <Input
                  data-testid="uni-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingUniversity(null); }}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="submit-university">{editingUniversity ? 'Update' : 'Submit'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Universities ({universities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : universities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No universities found. Add one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Placement %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((uni) => (
                  <TableRow key={uni.id} data-testid={`uni-row-${uni.id}`}>
                    <TableCell className="font-medium">{uni.name}</TableCell>
                    <TableCell>{uni.location}</TableCell>
                    <TableCell>{uni.rating}</TableCell>
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

// Applications Tab
const ApplicationsTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

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

  return (
    <div>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager',
    university_id: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchUniversities();
  }, []);

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
      await api.createUser(formData);
      toast.success('Manager added successfully!');
      fetchUsers();
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'manager',
        university_id: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add manager');
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">University Managers</h1>
          <p className="text-muted-foreground">Manage university manager accounts</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="add-manager-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Manager
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add University Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  data-testid="manager-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  data-testid="manager-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  data-testid="manager-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Assign University *</Label>
                <Select
                  value={formData.university_id}
                  onValueChange={(v) => setFormData({ ...formData, university_id: v })}
                >
                  <SelectTrigger data-testid="manager-university">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="submit-manager">Submit</Button>
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
            <div className="text-center py-8 text-muted-foreground">
              No managers found. Add one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
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

export default AdminDashboard;
