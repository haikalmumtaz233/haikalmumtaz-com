import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail, Instagram, Linkedin, Github, CheckCircle, XCircle, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import DOMPurify from 'dompurify';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps, revealEase } from '../../lib/motion';
import { profile, socialProfiles } from '../../data/profile';

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

const socialIcons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const Contact = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const sanitizeInput = (text: string): string => {
    return DOMPurify.sanitize(text.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[\d\s+\-()]{10,}$/;
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_NAME_LENGTH = 50;

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const loadTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
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

    if (window.turnstile) {
      loadTurnstile();
    } else {
      if (document.getElementById('turnstile-script')) return;

      const script = document.createElement('script');
      script.id = 'turnstile-script';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.honeypot) {
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      setTurnstileError(true);
      setIsSubmitting(false);
      addToast('error', 'Please complete the security check');
      return;
    }

    const sanitizedFirstName = sanitizeInput(formData.firstName);
    const sanitizedLastName = sanitizeInput(formData.lastName);
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedPhone = sanitizeInput(formData.phone);
    const sanitizedMessage = sanitizeInput(formData.message);

    if (sanitizedFirstName.length > MAX_NAME_LENGTH || sanitizedLastName.length > MAX_NAME_LENGTH) {
      setIsSubmitting(false);
      addToast('error', 'Name is too long. Maximum 50 characters.');
      return;
    }

    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      setIsSubmitting(false);
      addToast('error', 'Invalid email format. Please use a valid email address.');
      return;
    }

    if (sanitizedPhone && !PHONE_REGEX.test(sanitizedPhone)) {
      setIsSubmitting(false);
      addToast('error', 'Invalid phone number format. Use only numbers, spaces, +, (), or -.');
      return;
    }

    if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
      setIsSubmitting(false);
      addToast('error', `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    if (sanitizedMessage.length === 0) {
      setIsSubmitting(false);
      addToast('error', 'Message cannot be empty.');
      return;
    }

    try {
      const templateParams = {
        title: "New Inquiry from Portfolio",
        name: `${sanitizedFirstName} ${sanitizedLastName}`,
        email: sanitizedEmail,
        phone: sanitizedPhone || 'Not provided',
        message: sanitizedMessage,
        time: new Date().toLocaleString()
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      addToast('success', 'Message sent successfully! I\'ll get back to you soon.');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', honeypot: '' });
      setTurnstileToken(null);

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Form submission error:', error);
      }
      addToast('error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = socialProfiles.map((social) => ({
    ...social,
    icon: socialIcons[social.label],
  }));

  return (
    <section className="relative bg-transparent py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden">
      <div
        className="fixed top-6 right-6 z-50 flex flex-col gap-3"
        role="status"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100, scale: 0.9 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease: revealEase }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border ${
                toast.type === 'success'
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium pr-2">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 2xl:gap-24">

          <motion.div
            {...animatedProps(prefersReducedMotion, {
              initial: { opacity: 0, x: -50 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 },
            })}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-display font-black text-white uppercase tracking-tight leading-none mb-4 sm:mb-6">
              Let's work <br />
              together
            </h2>

            <p className="text-slate-400 text-sm sm:text-base 2xl:text-lg mb-6 sm:mb-8 max-w-md">
              Have a project in mind or just want to say hi? I'm always open to discussing new projects, or opportunities to be part of your visions.
            </p>

            <div className="space-y-6">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center gap-3 text-base md:text-lg 2xl:text-2xl text-white hover:text-white/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Mail size={18} />
                </div>
                <span>{profile.email}</span>
              </a>

              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...animatedProps(prefersReducedMotion, {
              initial: { opacity: 0, x: 50 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.8, delay: 0.2 },
            })}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-6 2xl:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-first-name" className="text-xs text-slate-400 uppercase tracking-wider font-mono">First Name</label>
                  <input
                    type="text"
                    id="contact-first-name"
                    name="firstName"
                    required
                    maxLength={50}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-1.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="contact-last-name" className="text-xs text-slate-400 uppercase tracking-wider font-mono">Last Name</label>
                  <input
                    type="text"
                    id="contact-last-name"
                    name="lastName"
                    required
                    maxLength={50}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-1.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-email" className="text-xs text-slate-400 uppercase tracking-wider font-mono">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-1.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="contact-phone" className="text-xs text-slate-400 uppercase tracking-wider font-mono">Phone</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    pattern="[\d\s+\-()]{10,}"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-1.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="+62..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-message" className="text-xs text-slate-400 uppercase tracking-wider font-mono">Message</label>
                <textarea
                  id="contact-message"
                    name="message"
                  required
                  rows={3}
                  maxLength={2000}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-1.5 text-sm text-white focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
                <p className="text-[10px] text-slate-400 text-right">
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </p>
              </div>

              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                autoComplete="off"
              />

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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group bg-white text-black font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
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
