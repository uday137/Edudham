import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, TrendingUp, Phone, Mail, Globe, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/utils/api';
import ApplyModal from '@/components/ApplyModal';
import { toast } from 'sonner';

const UniversityDetailPage = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const fetchUniversity = async () => {
    try {
      const data = await api.getUniversity(id);
      setUniversity(data);
    } catch (error) {
      console.error('Error fetching university:', error);
      toast.error('Failed to load university details');
    } finally {
      setLoading(false);
    }
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
          <p className="text-xl text-muted-foreground mb-4">University not found</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Search</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary">Edu Dham</h1>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={university.main_photo}
          alt={university.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-semibold">{university.rating}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2" data-testid="university-name">{university.name}</h1>
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              <span>{university.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="fees" data-testid="tab-fees">Fees</TabsTrigger>
                <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
                <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About University</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {university.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-accent" />
                          <span className="font-semibold">Placement Rate</span>
                        </div>
                        <div className="text-3xl font-bold text-accent">
                          {university.placement_percentage}%
                        </div>
                      </div>

                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-5 h-5 text-primary" />
                          <span className="font-semibold">Total Courses</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {university.courses_offered.length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fees" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {university.fee_structure.length === 0 ? (
                      <p className="text-muted-foreground">No fee structure available</p>
                    ) : (
                      <div className="space-y-4">
                        {university.fee_structure.map((fee, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                            data-testid={`fee-item-${idx}`}
                          >
                            <div>
                              <div className="font-semibold text-lg">{fee.course}</div>
                              <div className="text-sm text-muted-foreground">Duration: {fee.duration}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Annual Fee</div>
                              <div className="text-2xl font-bold text-primary">
                                ₹{(fee.annual_fee / 100000).toFixed(1)}L
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Courses Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {university.courses_offered.length === 0 ? (
                      <p className="text-muted-foreground">No courses listed</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {university.courses_offered.map((course, idx) => (
                          <div
                            key={idx}
                            className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                            data-testid={`course-${idx}`}
                          >
                            <GraduationCap className="w-5 h-5 text-primary mb-2" />
                            <div className="font-semibold">{course}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Photo Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {university.photo_gallery.length === 0 ? (
                      <p className="text-muted-foreground">No photos available</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {university.photo_gallery.map((photo, idx) => (
                          <div key={idx} className="aspect-video overflow-hidden rounded-lg">
                            <img
                              src={photo}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setApplyModalOpen(true)}
                  data-testid="apply-now-sidebar"
                >
                  Apply Now
                </Button>

                {university.contact_details && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Contact Details</h4>
                    {university.contact_details.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{university.contact_details.phone}</span>
                      </div>
                    )}
                    {university.contact_details.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{university.contact_details.email}</span>
                      </div>
                    )}
                    {university.contact_details.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={university.contact_details.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {university.tags && university.tags.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {university.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-muted text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        university={university}
      />
    </div>
  );
};

export default UniversityDetailPage;