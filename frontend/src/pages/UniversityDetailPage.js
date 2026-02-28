import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, TrendingUp, Phone, Mail, Globe, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/utils/api';
import ApplyModal from '@/components/ApplyModal';
import { toast } from 'sonner';
import { useBranding } from '@/context/BrandingContext';

const UniversityDetailPage = () => {
  const { id } = useParams();
  const { siteName, logoUrl } = useBranding();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
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
    fetchUniversity();
  }, [id]);

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
      <header className="bg-secondary text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Search</span>
          </Link>
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-white">{siteName}</h1>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-[500px] overflow-hidden bg-slate-900">
        {university.main_photo ? (
          <>
            {/* Blurred Background */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${university.main_photo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px) brightness(0.7)',
                transform: 'scale(1.1)', // Prevents blur edges from showing
              }}
            />
            {/* Main Full Image */}
            <img
              src={university.main_photo}
              alt={university.name}
              className="relative w-full h-full object-contain z-10"
            />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <GraduationCap size={120} color="#fff" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-30">
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="courses" data-testid="tab-courses">Courses & Fees</TabsTrigger>
                <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <CardTitle className="mb-4">About University</CardTitle>
                        <p className="text-muted-foreground leading-relaxed">
                          {university.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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
                            {university.courses?.length || 0}
                          </div>
                        </div>
                      </div>

                      {university.courses && university.courses.length > 0 && (
                        <div className="pt-6 border-t border-border">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            Popular Courses
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {university.courses.slice(0, 2).map((course, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 bg-muted rounded-full text-sm font-medium border border-border"
                              >
                                {course.course_name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {university.photo_gallery.length > 0 && (
                        <div className="pt-6 border-t border-border">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Gallery Highlights
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            {university.photo_gallery.slice(0, 3).map((photo, idx) => (
                              <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                                <img
                                  src={photo}
                                  alt={`Highlight ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Courses & Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!university.courses || university.courses.length === 0) ? (
                      <p className="text-muted-foreground">No courses listed</p>
                    ) : (
                      <div className="space-y-8">
                        {Object.entries(
                          university.courses.reduce((acc, course) => {
                            const cat = course.category || "General";
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(course);
                            return acc;
                          }, {})
                        ).map(([category, catCourses], idx) => (
                          <div key={idx}>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2 text-primary">
                              <GraduationCap className="w-5 h-5" />
                              {category}
                            </h3>
                            <div className="space-y-4">
                              {catCourses.map((course, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="p-4 border border-border rounded-lg hover:border-primary transition-colors bg-card shadow-sm"
                                  data-testid={`course-${idx}-${cIdx}`}
                                >
                                  <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                                    <div className="flex-1">
                                      <div className="font-semibold text-lg mb-1">{course.course_name}</div>
                                      {course.description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                          {course.description}
                                        </p>
                                      )}
                                      <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                                        ⏱ Duration: {course.duration || 'N/A'}
                                      </div>
                                    </div>
                                    <div className="mt-3 md:mt-0 md:text-right bg-primary/5 p-3 rounded-md flex flex-col items-center md:items-end justify-center min-w-[140px]">
                                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Annual Fee</div>
                                      <div className="text-xl font-bold text-primary">
                                        {course.fees > 0 ? `₹${(course.fees / 100000).toFixed(1)}L` : 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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

                {university.university_categories && university.university_categories.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {university.university_categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
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