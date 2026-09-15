import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, CheckCircle, XCircle, X } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';
import { SECTION_TITLE_CLASS } from '../ui/SectionHeader';
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
const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;

const EMPTY_FORM = { name: '', email: '', message: '', honeypot: '' };

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const fieldClass =
  'w-full border-b border-white/20 bg-transparent py-3 text-base text-white placeholder:text-white/30 transition-colors duration-300 focus:border-white focus:outline-none';

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

      const name = sanitize(formData.name);
      const email = sanitize(formData.email);
      const message = sanitize(formData.message);

      if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
        addToast('error', `Enter a name up to ${MAX_NAME_LENGTH} characters.`);
        return;
      }

      if (!EMAIL_REGEX.test(email)) {
        addToast('error', 'Enter a valid email address, like name@example.com.');
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
          name,
          email,
          phone: 'Not provided',
          message,
          time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      addToast('success', "Message sent. I'll reply to your email.");
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
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RuleReveal lines={["Let's work", 'together']} className={SECTION_TITLE_CLASS} />

            <FadeIn>
              <p className="mt-6 max-w-sm text-base text-white/60 md:mt-8 2xl:text-lg">
                Have a project or a role in mind? Tell me about it.
              </p>

              <a
                href={`mailto:${profile.email}`}
                className="group mt-10 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-lg text-white transition-colors duration-300 hover:border-white md:text-xl"
              >
                {profile.email}
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {socialProfiles.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] text-white/60 transition-colors duration-300 hover:text-white"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={MAX_NAME_LENGTH}
                    value={formData.name}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
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
                  rows={4}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${fieldClass} resize-none`}
                  placeholder="What are you working on?"
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

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div ref={turnstileRef} className="min-h-[65px]" />
                  {turnstileError && (
                    <p className="mt-2 text-sm text-red-300">Complete the security check to send.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black isolate disabled:opacity-50"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full bg-purple-200 transition-transform duration-500 ease-expo group-hover:scale-y-100"
                  />
                  {isSubmitting ? 'Sending message' : 'Send message'}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;
