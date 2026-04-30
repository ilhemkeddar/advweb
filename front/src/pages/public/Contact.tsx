import { useState } from 'react'
import { Mail, MapPin, Phone, Send, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '../../components/ui'
import contactService, { ContactMessage } from '../../services/contactService'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await contactService.submitMessage(formData)
      setSuccess(true)
      setFormData({ fullName: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0A5F7F] via-[#0A5F7F] to-[#06B6D4] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-5xl text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-white/80 max-w-3xl">
            Have questions about our AI programs? Want to become a workshop instructor? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Contact Information (35%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Email Card */}
            <Card className="border border-[rgba(15,20,25,0.08)] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A5F7F]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#0A5F7F]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-[#0F1419] mb-1">Email</h3>
                    <p className="text-sm text-[#64748B] mb-2">Send us an email</p>
                    <a href="mailto:ai-house@univ-blida.dz" className="text-[#0A5F7F] hover:underline text-sm font-medium">
                      ai-house@univ-blida.dz
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border border-[rgba(15,20,25,0.08)] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A5F7F]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#0A5F7F]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-[#0F1419] mb-1">Location</h3>
                    <p className="text-sm text-[#64748B] mb-2">Visit our office</p>
                    <p className="text-sm text-[#0F1419]">
                      Saad Dahleb University<br />
                      Blida, Algeria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="border border-[rgba(15,20,25,0.08)] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A5F7F]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#0A5F7F]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-[#0F1419] mb-1">Phone</h3>
                    <p className="text-sm text-[#64748B] mb-2">Call us during office hours</p>
                    <p className="text-sm text-[#0F1419]">+213 (0) 25 XX XX XX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Forms & Details (65%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Contact Form Card */}
            <Card className="border border-[rgba(15,20,25,0.08)] shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl text-[#0F1419] mb-6">Send Us a Message</h2>
                
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5"/>
                    <p className="text-sm text-green-700">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5"/>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0F1419] mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(15,20,25,0.15)] text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F1419] mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(15,20,25,0.15)] text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F1419] mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[rgba(15,20,25,0.15)] text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F1419] mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[rgba(15,20,25,0.15)] text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#0A5F7F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#084f6a] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card className="border border-[rgba(15,20,25,0.08)] shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-xl text-[#0F1419] mb-4">For Workshop Instructors</h2>
                <p className="text-[#64748B] mb-6 leading-relaxed">
                  Are you a faculty member interested in conducting an AI workshop? We welcome proposals from all departments. Please create a professor account and submit your workshop proposal through the dashboard.
                </p>
                <button className="inline-flex items-center gap-2 border border-[rgba(15,20,25,0.15)] text-[#0F1419] bg-white px-6 py-3 rounded-xl font-medium hover:bg-[#F0F4F8] transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
