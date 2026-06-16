import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsAndConditionsPage = () => {
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Terms & <span className="text-primary">Conditions</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our website or services.
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
              Welcome to <strong>EduDham Technologies Private Limited</strong>.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              By accessing or using our website, services, forms, or advertisements, you agree to be bound by these Terms and Conditions.
            </p>
          </div>

          {/* Sections */}
          <div className="p-8 sm:p-10 space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="text-xl font-semibold text-secondary">About Us</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                EduDham Technologies Private Limited is an education consultancy and publishing company that provides:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Educational counseling',
                  'Admission assistance',
                  'Information regarding universities and courses',
                  'Lead generation and student referral services',
                  'Educational publishing and content services',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We act as a facilitator and information provider for students and educational institutions.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="text-xl font-semibold text-secondary">User Responsibilities</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By using our website or services, you agree that:
              </p>
              <ul className="space-y-2">
                {[
                  'The information provided by you is true and accurate.',
                  'You are at least 18 years old or are using the service under parental/guardian supervision.',
                  'You will not misuse the website or provide false information.',
                  'You will not engage in any unlawful activity while using our services.',
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
                <h3 className="text-xl font-semibold text-secondary">Admission Disclaimer</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                EduDham Technologies Private Limited assists students in admission-related processes. However:
              </p>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-3">
                {[
                  'Admission decisions are solely made by the respective universities or institutions.',
                  'We do not guarantee admission, scholarships, placements, or visa approvals.',
                  'Course fees, eligibility criteria, and admission requirements are determined by the universities and may change without prior notice.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-amber-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                <h3 className="text-xl font-semibold text-secondary">Intellectual Property</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All content available on this website, including text, logos, graphics, images, videos, and designs, is the intellectual property of EduDham Technologies Private Limited unless otherwise stated.
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Unauthorized copying, reproduction, or distribution is prohibited.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                <h3 className="text-xl font-semibold text-secondary">Limitation of Liability</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                EduDham Technologies Private Limited shall not be liable for:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Any admission rejection by universities.',
                  'Errors or omissions in information provided by third parties.',
                  'Losses arising from reliance on information available on the website.',
                  'Technical interruptions or website downtime.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-secondary font-medium">
                  Users are advised to verify information directly with the respective institutions before making any decisions.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">6</span>
                <h3 className="text-xl font-semibold text-secondary">Third-Party Services</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our website may contain links to third-party websites or services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We do not control or endorse such websites and are not responsible for their content, policies, or practices.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">7</span>
                <h3 className="text-xl font-semibold text-secondary">Privacy</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your use of our services is also governed by our{' '}
                <Link to="/privacy-policy" className="text-primary font-medium hover:underline">Privacy Policy</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our website, you consent to the collection and use of your information in accordance with our Privacy Policy.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">8</span>
                <h3 className="text-xl font-semibold text-secondary">Modification of Terms</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                EduDham Technologies Private Limited reserves the right to modify these Terms and Conditions at any time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Continued use of the website after any modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">9</span>
                <h3 className="text-xl font-semibold text-secondary">Governing Law</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
              </p>
              <div className="bg-slate-50 border border-border rounded-xl p-4">
                <p className="text-sm text-secondary font-medium">
                  Any disputes arising out of these Terms shall be subject to the jurisdiction of the courts located in Meerut, Uttar Pradesh, India.
                </p>
              </div>
            </section>

            {/* Section 10 — Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">10</span>
                <h3 className="text-xl font-semibold text-secondary">Contact Information</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For any questions regarding these Terms and Conditions, please contact:
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
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-primary transition-colors text-white">Terms & Conditions</Link>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Edu Dham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditionsPage;
