const variants = {
    departure: [
        'radial-gradient(125% 62% at 50% 96%, rgba(124, 58, 237, 0.30), transparent 68%)',
        'radial-gradient(70% 45% at 50% 4%, rgba(34, 211, 238, 0.12), transparent 66%)',
        'linear-gradient(to top, rgba(168, 85, 247, 0.10), transparent 55%)',
    ],
    record: [
        'radial-gradient(78% 48% at 74% 8%, rgba(34, 211, 238, 0.22), transparent 68%)',
        'radial-gradient(68% 44% at 14% 94%, rgba(217, 70, 239, 0.18), transparent 70%)',
        'linear-gradient(to bottom, rgba(10, 10, 10, 0.55), transparent 40%)',
    ],
} as const;

interface SectionAtmosphereProps {
    variant: keyof typeof variants;
}

const SectionAtmosphere = ({ variant }: SectionAtmosphereProps) => (
    <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ backgroundImage: variants[variant].join(', ') }}
    />
);

export default SectionAtmosphere;
