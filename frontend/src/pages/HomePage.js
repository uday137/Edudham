import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, GraduationCap, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/ApplyModal';

const HomePage = () => {
  const { user } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    course_type: '',
    min_fee: '',
    max_fee: '',
    min_rating: '',
    min_placement: '',
  });
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const data = await api.getUniversities();
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Live search with debounce
  const filteredUniversities = useMemo(() => {
    let filtered = universities;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (uni) =>
          uni.name.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query) ||
          uni.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [universities, searchQuery]);

  const handleFilterSearch = async () => {
    setLoading(true);
    try {
      const cleanFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          cleanFilters[key] = filters[key];
        }
      });
      if (searchQuery) {
        cleanFilters.search = searchQuery;
      }
      const data = await api.getUniversities(cleanFilters);
      setUniversities(data);
    } catch (error) {
      console.error('Error filtering universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (university) => {
    setSelectedUniversity(university);
    setApplyModalOpen(true);
  };

  const getAvgFee = (feeStructure) => {
    if (!feeStructure || feeStructure.length === 0) return 'N/A';
    const fees = feeStructure.map((f) => f.annual_fee);
    const avg = fees.reduce((a, b) => a + b, 0) / fees.length;
    return `₹${(avg / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary">Edu Dham</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/manager'}
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-secondary text-white py-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1680084521806-b408d976e3e7?crop=entropy&cs=srgb&fm=jpg&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-secondary/80"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Find Your Perfect
            <br />
            <span className="text-primary">College Match</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Explore universities across Uttar Pradesh. Compare courses, fees, and facilities to make the right choice for your future.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  data-testid="home-search-input"
                  placeholder="Search by university name, location, or tags..."
                  className="border-0 focus-visible:ring-0 text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button data-testid="search-button" onClick={handleFilterSearch}>
                Search <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
              <SelectTrigger data-testid="filter-location">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Lucknow">Lucknow</SelectItem>
                <SelectItem value="Kanpur">Kanpur</SelectItem>
                <SelectItem value="Varanasi">Varanasi</SelectItem>
                <SelectItem value="Agra">Agra</SelectItem>
                <SelectItem value="Noida">Noida</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.course_type} onValueChange={(v) => setFilters({ ...filters, course_type: v })}>
              <SelectTrigger data-testid="filter-course">
                <SelectValue placeholder="Course Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
              </SelectContent>
            </Select>

            <Input
              data-testid="filter-min-fee"
              placeholder="Min Fee (₹)"
              type="number"
              value={filters.min_fee}
              onChange={(e) => setFilters({ ...filters, min_fee: e.target.value })}
            />

            <Input
              data-testid="filter-max-fee"
              placeholder="Max Fee (₹)"
              type="number"
              value={filters.max_fee}
              onChange={(e) => setFilters({ ...filters, max_fee: e.target.value })}
            />

            <Select value={filters.min_rating} onValueChange={(v) => setFilters({ ...filters, min_rating: v })}>
              <SelectTrigger data-testid="filter-rating">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Ratings</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.min_placement} onValueChange={(v) => setFilters({ ...filters, min_placement: v })}>
              <SelectTrigger data-testid="filter-placement">
                <SelectValue placeholder="Min Placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Placement %</SelectItem>
                <SelectItem value="70">70%+</SelectItem>
                <SelectItem value="80">80%+</SelectItem>
                <SelectItem value="90">90%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="stat-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary">{universities.length}+</div>
                <div className="text-sm text-muted-foreground">Top Universities</div>
              </CardContent>
            </Card>

            <Card className="stat-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-secondary">95%</div>
                <div className="text-sm text-muted-foreground">Placement Rate</div>
              </CardContent>
            </Card>

            <Card className="stat-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </CardContent>
            </Card>

            <Card className="stat-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-secondary">100%</div>
                <div className="text-sm text-muted-foreground">Verified Institutions</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-secondary mb-8">Explore Universities</h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No universities found. Try different filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((university) => (
                <Card key={university.id} className="university-card overflow-hidden" data-testid={`university-card-${university.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={university.main_photo}
                      alt={university.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{university.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-secondary mb-2">{university.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{university.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Annual Fees</div>
                        <div className="font-semibold text-primary text-lg">{getAvgFee(university.fee_structure)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground">Placement</div>
                        <div className="font-semibold text-accent text-lg">{university.placement_percentage}%</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {university.courses_offered.slice(0, 2).map((course, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
                        >
                          {course}
                        </span>
                      ))}
                      {university.courses_offered.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground">
                          +{university.courses_offered.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/university/${university.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" data-testid={`view-details-${university.id}`}>
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="flex-1"
                        onClick={() => handleApplyClick(university)}
                        data-testid={`apply-now-${university.id}`}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2024 Edu Dham. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Connecting students with their dream universities</p>
        </div>
      </footer>

      {/* Apply Modal */}
      <ApplyModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        university={selectedUniversity}
      />
    </div>
  );
};

export default HomePage;