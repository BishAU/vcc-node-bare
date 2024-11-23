import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Phone',
      details: ['(555) 123-4567', 'Mon-Fri 9:00 AM - 5:00 PM'],
    },
    {
      icon: FiMail,
      title: 'Email',
      details: ['contact@vcc.com', 'support@vcc.com'],
    },
    {
      icon: FiMapPin,
      title: 'Location',
      details: ['123 Business Street', 'Vancouver, BC V6B 1A1'],
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: ['Monday - Friday', '9:00 AM - 5:00 PM PST'],
    },
  ];

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <h1 className={sharedStyles.heading}>Contact Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item) => (
                <div key={item.title} className={sharedStyles.card}>
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      {item.details.map((detail, index) => (
                        <p key={index} className="text-gray-300">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className={sharedStyles.card}>
                <h2 className={sharedStyles.cardHeader}>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={sharedStyles.form.group}>
                      <label htmlFor="name" className={sharedStyles.form.label}>Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={sharedStyles.form.input}
                        required
                      />
                    </div>
                    <div className={sharedStyles.form.group}>
                      <label htmlFor="email" className={sharedStyles.form.label}>Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={sharedStyles.form.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={sharedStyles.form.group}>
                      <label htmlFor="phone" className={sharedStyles.form.label}>Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={sharedStyles.form.input}
                      />
                    </div>
                    <div className={sharedStyles.form.group}>
                      <label htmlFor="subject" className={sharedStyles.form.label}>Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={sharedStyles.form.select}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className={sharedStyles.form.group}>
                    <label htmlFor="message" className={sharedStyles.form.label}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={sharedStyles.form.textarea}
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={combineClasses(
                        sharedStyles.button.base,
                        sharedStyles.button.primary,
                        'w-full md:w-auto'
                      )}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contact;
