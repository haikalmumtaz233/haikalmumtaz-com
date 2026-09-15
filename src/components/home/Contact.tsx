import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail, Instagram, Linkedin, Github, CheckCircle, XCircle, X } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';
import { revealEase } from '../../lib/motion';
import { profile, socialProfiles } from '../../data/profile';

declare global {
  interface Window {
    turnstile?: {
      ready: (callback: () => void) => void;
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
    onloadTurnstileCallback?: () => void;
  }
}

const TURNSTILE_SCRIPT_ID = 'turnstile-script';
const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-()]{10,}$/;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 50;

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', message: '', honeypot: '' };

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

const inputClass =
  'w-full bg-transparent border-b border-white/20 py-2 text-[15px] text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors';

const labelClass = 'text-sm text-white/60';

const Contact = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearby(true);
        observer.disconnect();
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearby) return;

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !turnstileRef.current || widgetIdRef.current) return;

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
    };

    if (window.turnstile) {
      window.turnstile.ready(renderWidget);
    } else {
      window.onloadTurnstileCallback = renderWidget;

      if (!document.getElementById(TURNSTILE_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;

      if (window.onloadTurnstileCallback === renderWidget) {
        delete window.onloadTurnstileCallback;
      }

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isNearby]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) return;

    if (!turnstileToken) {
      setTurnstileError(true);
      addToast('error', 'Complete the security check, then send again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const [{ default: emailjs }, { default: DOMPurify }] = await Promise.all([
        import('@emailjs/browser'),
        import('dompurify'),
      ]);

      const sanitize = (text: string) =>
        DOMPurify.sanitize(text.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

      const firstName = sanitize(formData.firstName);
      const lastName = sanitize(formData.lastName);
      const email = sanitize(formData.email);
      const phone = sanitize(formData.phone);
      const message = sanitize(formData.message);

      if (firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
        addToast('error', `Shorten the name to ${MAX_NAME_LENGTH} characters each.`);
        return;
      }

      if (!EMAIL_REGEX.test(email)) {
        addToast('error', 'Enter a valid email address, like name@example.com.');
        return;
      }

      if (phone && !PHONE_REGEX.test(phone)) {
        addToast('error', 'Use only numbers, spaces, +, (), or - in the phone number.');
        return;
      }

      if (message.length === 0) {
        addToast('error', 'Write a message before sending.');
        return;
      }

      if (message.length > MAX_MESSAGE_LENGTH) {
        addToast('error', `Shorten the message to ${MAX_MESSAGE_LENGTH} characters.`);
        return;
      }

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          title: 'New Inquiry from Portfolio',
          name: `${firstName} ${lastName}`,
          email,
          phone: phone || 'Not provided',
          message,
          time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      addToast('success', "Message sent. I'll reply to your email soon.");
      setFormData(EMPTY_FORM);
      setTurnstileToken(null);

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Form submission error:', error);
      }
      addToast('error', `Message not sent. Try again, or email ${profile.email} directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative section-space overflow-hidden">
      <div
        className="fixed top-24 right-6 z-50 flex max-w-[calc(100vw-3rem)] flex-col gap-3"
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
              className={`flex items-center gap-3 rounded-xl border bg-[#09080e]/90 px-4 py-3 ${
                toast.type === 'success' ? 'border-emerald-500/30 text-emerald-300' : 'border-red-500/30 text-red-300'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="pr-2 text-sm font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="ml-auto rounded-full p-1 transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 2xl:gap-24">
          <div className="flex flex-col justify-center">
            <RuleReveal
              lines={["Let's work", 'together']}
              className="font-monument font-black uppercase text-white tracking-tight leading-[0.95] text-[clamp(2rem,4.6vw,4.5rem)]"
            />

            <FadeIn>
              <p className="mt-6 max-w-md text-base text-white/60 md:mt-8 2xl:text-lg">
                Have a project in mind or just want to say hi? I'm always open to new projects and opportunities.
              </p>

              <div className="mt-8 space-y-6 md:mt-10">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3 text-base text-white transition-colors hover:text-white/80 md:text-lg 2xl:text-2xl"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    <Mail size={18} />
                  </span>
                  <span>{profile.email}</span>
                </a>

                <div className="flex gap-3">
                  {socialProfiles.map((social) => {
                    const Icon = socialIcons[social.label];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:bg-white hover:text-black"
                        aria-label={social.label}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 2xl:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="contact-first-name" className={labelClass}>First name</label>
                    <input
                      type="text"
                      id="contact-first-name"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      maxLength={MAX_NAME_LENGTH}
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="contact-last-name" className={labelClass}>Last name</label>
                    <input
                      type="text"
                      id="contact-last-name"
                      name="lastName"
                      required
                      autoComplete="family-name"
                      maxLength={MAX_NAME_LENGTH}
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="contact-email" className={labelClass}>Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone <span className="text-white/35">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      autoComplete="tel"
                      pattern="[\d\s+\-()]{10,}"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="+62..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="contact-message" className={labelClass}>Message</label>
                    <span className="text-xs tabular-nums text-white/35">
                      {formData.message.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={3}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell me about your project..."
                  />
                </div>

                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <div ref={turnstileRef} className="flex min-h-[65px] justify-center" />
                  {turnstileError && (
                    <p className="mt-2 text-center text-sm text-red-300">Complete the security check to send.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-colors hover:bg-white/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending message' : 'Send message'}
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;
