const layers = [
    'radial-gradient(120% 62% at 50% 60%, rgba(124, 58, 237, 0.32), transparent 70%)',
    'radial-gradient(70% 45% at 50% 4%, rgba(34, 211, 238, 0.12), transparent 66%)',
];

const fade = 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)';

const SectionAtmosphere = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
            backgroundImage: layers.join(', '),
            WebkitMaskImage: fade,
            maskImage: fade,
        }}
    />
);

export default SectionAtmosphere;
