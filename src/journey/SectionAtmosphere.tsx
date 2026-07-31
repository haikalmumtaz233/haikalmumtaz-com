const layers = [
    'radial-gradient(125% 62% at 50% 96%, rgba(124, 58, 237, 0.30), transparent 68%)',
    'radial-gradient(70% 45% at 50% 4%, rgba(34, 211, 238, 0.12), transparent 66%)',
    'linear-gradient(to top, rgba(168, 85, 247, 0.10), transparent 55%)',
];

const SectionAtmosphere = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ backgroundImage: layers.join(', ') }}
    />
);

export default SectionAtmosphere;
