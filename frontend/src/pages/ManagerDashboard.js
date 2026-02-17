import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  FileText,
  LogOut,
  Download,
  GraduationCap,
  Edit,
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

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('university');
  const [university, setUniversity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user?.university_id) {
      fetchUniversity();
      fetchApplications();
    }
  }, [user]);

  const fetchUniversity = async () => {
    try {
      const data = await api.getUniversity(user.university_id);
      setUniversity(data);
      setFormData({
        name: data.name,
        location: data.location,
        main_photo: data.main_photo,
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
      await api.updateUniversity(user.university_id, formData);
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
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary">Edu Dham</h1>
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
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>University Details</CardTitle>
                    {!editMode && (
                      <Button
                        size="sm"
                        onClick={() => setEditMode(true)}
                        data-testid="edit-university-button"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <form onSubmit={handleUpdateUniversity} className="space-y-4">
                        <div className="space-y-2">
                          <Label>University Name</Label>
                          <Input
                            data-testid="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            data-testid="edit-location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Main Photo URL</Label>
                          <Input
                            data-testid="edit-photo"
                            value={formData.main_photo}
                            onChange={(e) => setFormData({ ...formData, main_photo: e.target.value })}
                            required
                          />
                        </div>

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

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Placement %</Label>
                            <Input
                              data-testid="edit-placement"
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={formData.placement_percentage}
                              onChange={(e) =>
                                setFormData({ ...formData, placement_percentage: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Rating</Label>
                            <Input
                              data-testid="edit-rating"
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
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
                                main_photo: university.main_photo,
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
                          <h3 className="text-2xl font-bold text-secondary mb-2" data-testid="uni-display-name">
                            {university.name}
                          </h3>
                          <p className="text-muted-foreground">{university.location}</p>
                        </div>

                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img
                            src={university.main_photo}
                            alt={university.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-muted-foreground">{university.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-accent/10 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Placement Rate</div>
                            <div className="text-2xl font-bold text-accent">
                              {university.placement_percentage}%
                            </div>
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
              </div>

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
                              onClick={() => {
                                if (window.confirm('Delete this application?')) {
                                  api.deleteApplication(app.id).then(() => {
                                    toast.success('Application deleted');
                                    fetchApplications();
                                  }).catch(() => toast.error('Failed to delete'));
                                }
                              }}
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
