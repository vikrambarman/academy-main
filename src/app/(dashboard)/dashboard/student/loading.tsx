export default function SegmentLoading() {
  return (
    <div className="portal-loading-segment">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="portal-loading-card" />
      ))}
    </div>
  );
}