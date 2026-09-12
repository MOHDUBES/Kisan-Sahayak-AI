/** NPUBadge — "Running on-device" indicator variants */
export default function NPUBadge({ variant = 'default', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`badge badge-green ${className}`}>
        <span className="badge-dot badge-dot-green" />
        On-Device
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <div className="badge badge-green">
        <span className="badge-dot badge-dot-green" />
        Running On-Device
      </div>
      <div className="badge badge-blue">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        0 Data Sent to Cloud
      </div>
    </div>
  );
}
