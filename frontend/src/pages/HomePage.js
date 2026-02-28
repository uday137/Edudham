import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, GraduationCap, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/ApplyModal';

const DEFAULT_HERO = {
  hero_title: 'Find Your Perfect',
  hero_title_highlight: 'College Match',
  hero_subtitle: 'Explore universities across Uttar Pradesh. Compare courses, fees, and facilities to make the right choice for your future.',
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

const HomePage = () => {
  const { user } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    category: '',
  });
  const [filterOptions, setFilterOptions] = useState({ locations: [], categories: [] });
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const universitiesSectionRef = useRef(null);

  // Hero config state
  const [heroConfig, setHeroConfig] = useState(DEFAULT_HERO);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchUniversities();
    fetchFilterOptions();
    fetchHeroConfig();
  }, []);

  // Slideshow auto-advance
  useEffect(() => {
    const imgs = heroConfig.background_images;
    if (!imgs || imgs.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imgs.length);
    }, heroConfig.slide_interval_ms || 5000);
    return () => clearInterval(interval);
  }, [heroConfig.background_images, heroConfig.slide_interval_ms]);

  const fetchFilterOptions = async () => {
    try {
      const data = await api.getFilterOptions();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchHeroConfig = async () => {
    try {
      const data = await api.getHomepageConfig();
      if (data) setHeroConfig({ ...DEFAULT_HERO, ...data });
    } catch (error) {
      console.error('Error fetching hero config:', error);
    }
  };

  // Scroll universities section into view when user starts typing
  // (removed — replaced with hero collapse approach)

  const isSearching = searchQuery.trim().length > 0;

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

  // Live search + filters — matches name, location, tags, courses, and description
  const filteredUniversities = useMemo(() => {
    let filtered = universities;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (uni) =>
          uni.name.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query) ||
          uni.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (uni.description && uni.description.toLowerCase().includes(query)) ||
          (uni.courses &&
            uni.courses.some(
              (c) =>
                c.course_name?.toLowerCase().includes(query) ||
                c.description?.toLowerCase().includes(query) ||
                c.category?.toLowerCase().includes(query)
            ))
      );
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter((uni) =>
        uni.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Category filter — checks new list field AND legacy string field
    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      filtered = filtered.filter((uni) => {
        const inList = Array.isArray(uni.university_categories) &&
          uni.university_categories.some((c) => c.toLowerCase() === cat);
        const inLegacy = (uni.university_category || '').toLowerCase().includes(cat);
        return inList || inLegacy;
      });
    }

    return filtered;
  }, [universities, searchQuery, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== 'all' && v !== '0') || searchQuery.trim();

  const clearAllFilters = () => {
    setFilters({ location: '', category: '' });
    setSearchQuery('');
  };

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

  const getMinFee = (courses) => {
    if (!courses || courses.length === 0) return 'N/A';

    const fees = courses.map((c) => c.fees).filter(f => f > 0);
    if (fees.length === 0) return 'N/A';
    const minFee = Math.min(...fees);

    return `₹${(minFee / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroConfig.logo_url ? (
              <img
                src={heroConfig.logo_url}
                alt={heroConfig.site_name || 'Logo'}
                style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '8px' }}
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-white">{heroConfig.site_name || 'Edu Dham'}</h1>
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

      {/* Hero Section — auto-rolling slideshow */}
      <section
        className="relative bg-secondary text-white"
        style={{
          paddingTop: isSearching ? '1.25rem' : '5rem',
          paddingBottom: isSearching ? '1.25rem' : '5rem',
          transition: 'padding 0.4s ease',
          overflow: 'hidden',
          minHeight: isSearching ? 0 : undefined,
        }}
      >
        {/* Slideshow layers — crossfade */}
        {heroConfig.background_images.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === currentSlide ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              // subtle Ken Burns zoom on active slide
              transform: i === currentSlide ? 'scale(1.04)' : 'scale(1)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '1.2s, 8s',
            }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-secondary/75" style={{ zIndex: 1 }} />

        <div className="relative max-w-7xl mx-auto px-6 text-center" style={{ zIndex: 2 }}>
          {/* Title + subtitle collapse when searching */}
          <div
            style={{
              maxHeight: isSearching ? '0px' : '220px',
              opacity: isSearching ? 0 : 1,
              overflow: 'hidden',
              transition: 'max-height 0.4s ease, opacity 0.3s ease',
              marginBottom: isSearching ? 0 : undefined,
            }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ color: heroConfig.hero_title_color || '#ffffff' }}>
              {heroConfig.hero_title}
              <br />
              <span style={{ color: heroConfig.hero_highlight_color || '#f97316' }}>{heroConfig.hero_title_highlight}</span>
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{ color: heroConfig.hero_subtitle_color || '#cbd5e1' }}>
              {heroConfig.hero_subtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  data-testid="home-search-input"
                  placeholder="Search by name, location, course, or tags..."
                  className="border-0 focus-visible:ring-0 text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button data-testid="search-button" onClick={handleFilterSearch}>
                {heroConfig.cta_text || 'Search'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Slide indicator dots — only when not searching */}
          {!isSearching && heroConfig.background_images.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', zIndex: 2 }}>
              {heroConfig.background_images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{
                    width: i === currentSlide ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === currentSlide ? '#f97316' : 'rgba(255,255,255,0.45)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {/* Location — dynamic from backend */}
            <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
              <SelectTrigger data-testid="filter-location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {filterOptions.locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category — dynamic from backend */}
            <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
              <SelectTrigger data-testid="filter-course">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterOptions.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filter indicator + clear button */}
          {hasActiveFilters && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">
                Showing {filteredUniversities.length} of {universities.length} universities
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Strip — compact horizontal badges, collapses when searching */}
      <div
        style={{
          maxHeight: isSearching ? '0px' : '80px',
          opacity: isSearching ? 0 : 1,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
        }}
      >
        <div className="bg-slate-50 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-lg font-bold text-secondary">{universities.length}+</span>
                  <span className="text-xs text-muted-foreground ml-1">Universities</span>
                </div>
              </div>
              <div className="w-px h-6 bg-border hidden md:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-lg font-bold text-secondary">95%</span>
                  <span className="text-xs text-muted-foreground ml-1">Placement Rate</span>
                </div>
              </div>
              <div className="w-px h-6 bg-border hidden md:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-lg font-bold text-secondary">50+</span>
                  <span className="text-xs text-muted-foreground ml-1">Cities Covered</span>
                </div>
              </div>
              <div className="w-px h-6 bg-border hidden md:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-lg font-bold text-secondary">100%</span>
                  <span className="text-xs text-muted-foreground ml-1">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-8" ref={universitiesSectionRef}>
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
                        <div className="text-muted-foreground">Starting Annual Fees</div>
                        <div className="font-semibold text-primary text-lg">{getMinFee(university.courses)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground">Placement</div>
                        <div className="font-semibold text-accent text-lg">{university.placement_percentage}%</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {(university.courses || []).slice(0, 2).map((course, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
                        >
                          {course.course_name}
                        </span>
                      ))}
                      {university.courses && university.courses.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground">
                          +{university.courses.length - 2} more
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

      {/* Footer — conditionally shown */}
      {heroConfig.show_footer && (
        <footer className="bg-secondary text-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm">© {new Date().getFullYear()} {heroConfig.site_name || 'Edu Dham'}. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-2">Connecting students with their dream universities</p>
          </div>
        </footer>
      )}

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