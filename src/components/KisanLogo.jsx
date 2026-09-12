import React from 'react';

/**
 * KisanLogo - Official Emblem & Brand Component
 * Features the custom circular emblem combining AI circuit traces,
 * partnership handshake ("Sahayak"), growth arrow, green leaves & Rupee symbol.
 */
export default function KisanLogo({
  size = 42,
  showText = true,
  layout = 'horizontal', // 'horizontal' | 'vertical' | 'icon-only'
  theme = 'light',       // 'light' | 'dark'
  className = '',
  onClick,
}) {
  const isDark = theme === 'dark';

  if (layout === 'icon-only') {
    return (
      <div
        onClick={onClick}
        className={`relative flex-shrink-0 inline-flex items-center justify-center transition-transform duration-200 hover:scale-105 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        title="Kisan Sahayak AI"
      >
        <img
          src="/kisan-emblem.png"
          alt="Kisan Sahayak Logo"
          className="w-full h-full object-contain select-none filter drop-shadow-sm"
          draggable="false"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 ${layout === 'vertical' ? 'flex-col text-center' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Circular Emblem Mark */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <img
          src="/kisan-emblem.png"
          alt="Kisan Sahayak Logo"
          className="w-full h-full object-contain select-none filter drop-shadow-sm"
          draggable="false"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`leading-tight ${layout === 'vertical' ? 'text-center' : 'text-left'}`}>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm sm:text-lg font-black tracking-tight font-heading whitespace-nowrap ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Kisan Sahayak
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
              AI
            </span>
          </div>
          <div
            className={`text-[11px] sm:text-xs font-hindi font-medium hidden xl:block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            किसान सहायक · Rural AI Assistant
          </div>
        </div>
      )}
    </div>
  );
}
