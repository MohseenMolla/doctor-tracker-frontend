export default function ChartPanel({ title, subtitle, children, className = '' }) {
  return (
    <section className={`panel p-5 ${className}`}>
      <h2 className="text-base font-semibold">{title}</h2>
      {subtitle && <p className="mb-4 mt-0.5 text-xs text-ink-500">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </section>
  );
}
