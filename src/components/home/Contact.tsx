import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Instagram, Linkedin, Github } from 'lucide-react';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Load Turnstile script and render widget
  useEffect(() => {
    const loadTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: '0x4AAAAAACKC_rdGcHxbc3VL',
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(false);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
          },
          'error-callback': () => {
            setTurnstileError(true);
          },
          theme: 'dark',
        });
      }
    };

    // Check if script already loaded
    if (window.turnstile) {
      loadTurnstile();
    } else {
      // Load the Turnstile script
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = loadTurnstile;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // === HONEYPOT CHECK ===
    if (formData.honeypot) {
      console.log('Spam detected');
      setIsSubmitting(false);
      return;
    }

    // === TURNSTILE VALIDATION ===
    if (!turnstileToken) {
      setTurnstileError(true);
      setIsSubmitting(false);
      return;
    }

    // === WHATSAPP FORMATTING ===
    // GANTI NOMOR INI DENGAN NOMOR WA KAMU (Format: 628...)
    const phoneNumber = '6285228518483'; 
    
    const text = `
*New Contact Form Submission*
---------------------------
*Name:* ${formData.firstName} ${formData.lastName}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
---------------------------
*Message:*
${formData.message}
    `.trim();

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    // Simulate generic delay for UX then redirect
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      setIsSubmitting(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', honeypot: '' });
      setTurnstileToken(null);
      // Reset Turnstile widget
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }, 1000);
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/haikalmumtaz233', label: 'Github' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/haikal-mumtaz/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/haikal_mumtaz23/', label: 'Instagram' },
  ];

  return (
    <section className="relative bg-transparent py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* === LEFT COLUMN: INFO === */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-monument font-black text-white uppercase tracking-tight leading-none mb-8">
              Let's work <br />
              together
            </h2>
            
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Have a project in mind or just want to say hi? I'm always open to discussing new projects, or opportunities to be part of your visions.
            </p>

            <div className="space-y-8">
              {/* EMAIL */}
              <a 
                href="mailto:hmumtaz70@gmail.com" 
                className="group flex items-center gap-4 text-xl md:text-2xl text-white hover:text-gray-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Mail size={20} />
                </div>
                <span>hmumtaz70@gmail.com</span>
              </a>

              {/* SOCIALS */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* === RIGHT COLUMN: FORM === */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ROW 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 uppercase tracking-wider font-mono">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 uppercase tracking-wider font-mono">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* ROW 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 uppercase tracking-wider font-mono">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 uppercase tracking-wider font-mono">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="+62..."
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <label className="text-sm text-gray-500 uppercase tracking-wider font-mono">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* === HONEYPOT (HIDDEN) === */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                autoComplete="off"
              />

              {/* === CLOUDFLARE TURNSTILE WIDGET === */}
              <div className="w-full">
                <div 
                  ref={turnstileRef} 
                  className="flex justify-center"
                />
                {turnstileError && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    Please complete the security check
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group bg-white text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;