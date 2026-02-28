import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/utils/api';
import { toast } from 'sonner';

const ApplyModal = ({ open, onClose, university }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course_interest: '',
    short_note: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createApplication({
        ...formData,
        university_id: university.id,
        university_name: university.name,
      });
      toast.success('Application submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        course_interest: '',
        short_note: '',
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!university) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="apply-modal">
        <DialogHeader>
          <DialogTitle>Apply to {university.name}</DialogTitle>
          <DialogDescription>
            Fill in your details below to apply to this university.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              data-testid="apply-name"
              id="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              data-testid="apply-email"
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              data-testid="apply-phone"
              id="phone"
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course_interest">Course Interest *</Label>
            <Input
              data-testid="apply-course"
              id="course_interest"
              placeholder="e.g., B.Tech Computer Science"
              value={formData.course_interest}
              onChange={(e) => handleChange('course_interest', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_note">Short Note *</Label>
            <Textarea
              data-testid="apply-note"
              id="short_note"
              placeholder="Tell us why you're interested in this university..."
              value={formData.short_note}
              onChange={(e) => handleChange('short_note', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button data-testid="apply-submit" type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;