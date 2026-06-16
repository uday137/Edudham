import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Edu Dham</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-secondary text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, hsl(211, 100%, 50%) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(211, 100%, 60%) 0%, transparent 50%)',
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-6 backdrop-blur-sm border border-primary/30">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how EduDham Technologies Private Limited collects, uses, and protects your personal information.
          </p>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {/* Introduction */}
          <div className="p-8 sm:p-10 border-b border-border bg-gradient-to-br from-blue-50/50 to-transparent">
            <p className="text-foreground leading-relaxed">
              Welcome to <strong>EduDham Technologies Private Limited</strong> ("Company", "We", "Our", or "Us").
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              EduDham Technologies Private Limited is an education consultancy and publishing company that provides educational information, student counseling, admission assistance, and lead generation services for various universities and educational institutions.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              We are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly.
            </p>
          </div>

          {/* Sections */}
          <div className="p-8 sm:p-10 space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="text-xl font-semibold text-secondary">Information We Collect</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you visit our website or submit your details through Google Forms, advertisements, or any other medium, we may collect:
              </p>
              <ul className="space-y-2 mb-6">
                {['Full Name', 'Mobile Number', 'Email Address', 'City and State', 'Educational Qualifications', 'Preferred Course or University', 'Any additional information voluntarily provided by you'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">We may also collect:</p>
              <ul className="space-y-2">
                {['IP Address', 'Browser type', 'Device information', 'Website usage statistics through cookies and analytics tools'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="text-xl font-semibold text-secondary">How We Use Your Information</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="space-y-2">
                {[
                  'To provide educational counseling and admission assistance.',
                  'To connect students with universities and educational institutions.',
                  'To respond to inquiries and provide relevant information.',
                  'To send updates regarding courses, universities, admissions, scholarships, and educational opportunities.',
                  'To improve our services and user experience.',
                  'To comply with legal and regulatory requirements.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="text-xl font-semibold text-secondary">Sharing of Information</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By submitting your information, you agree that EduDham Technologies Private Limited may share your information with:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Universities and educational institutions.',
                  'Authorized admission partners.',
                  'Service providers assisting in admission and counseling processes.',
                  'Government or legal authorities when required by law.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-secondary font-medium">
                  We do not sell your personal information to unauthorized third parties.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                <h3 className="text-xl font-semibold text-secondary">Cookies</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our website may use cookies and similar technologies to:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Improve website functionality.',
                  'Analyze user behavior.',
                  'Enhance user experience.',
                  'Deliver relevant advertisements.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You can disable cookies through your browser settings.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                <h3 className="text-xl font-semibold text-secondary">Data Security</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, misuse, disclosure, or alteration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">6</span>
                <h3 className="text-xl font-semibold text-secondary">Third-Party Links</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites, universities, or institutions. We are not responsible for the privacy practices or content of such websites.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">7</span>
                <h3 className="text-xl font-semibold text-secondary">Consent</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By using our website or submitting your information through forms, advertisements, or any other medium, you consent to the collection and use of your information as described in this Privacy Policy.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">8</span>
                <h3 className="text-xl font-semibold text-secondary">Changes to This Privacy Policy</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or update this Privacy Policy at any time. Changes will be posted on this page with the updated effective date.
              </p>
            </section>

            {/* Section 9 — Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">9</span>
                <h3 className="text-xl font-semibold text-secondary">Contact Us</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                If you have any questions regarding this Privacy Policy, you may contact us at:
              </p>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-secondary text-lg mb-4">EDUDHAM Technologies Pvt Ltd</h4>
                <div className="space-y-3">
                  <a href="mailto:edudhaminfo@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span>edudhaminfo@gmail.com</span>
                  </a>
                  <a href="tel:+918273794004" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <span>+91 82737 94004</span>
                  </a>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span>Dayanatpur, Gautam Buddha Nagar, U.P. Pin Code 203135</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Edu Dham</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors text-white">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Edu Dham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
