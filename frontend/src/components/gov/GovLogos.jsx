import React from 'react';

/**
 * Government of India Ashoka Emblem SVG
 */
export const GovIndiaEmblem = ({ className = "w-8 h-8", color = "#FF9933" }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Pillar Top */}
    <path d="M20 95 H80 V105 H20 Z" fill={color} opacity="0.9" />
    <path d="M15 105 H85 V112 H15 Z" fill={color} />
    {/* Dharma Chakra in Center */}
    <circle cx="50" cy="80" r="12" stroke={color} strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="80" r="3" fill={color} />
    {/* Chakra Spokes */}
    {Array.from({ length: 12 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="80"
        x2={50 + 10 * Math.cos((i * 30 * Math.PI) / 180)}
        y2={80 + 10 * Math.sin((i * 30 * Math.PI) / 180)}
        stroke={color}
        strokeWidth="1.2"
      />
    ))}
    {/* Bull & Horse outline details */}
    <path d="M25 80 Q20 78 22 84 Q28 85 32 80 Z" fill={color} />
    <path d="M75 80 Q80 78 78 84 Q72 85 68 80 Z" fill={color} />
    {/* Ashoka Lions Silhouette */}
    <path d="M50 15 C35 15 32 30 35 45 C30 50 25 58 30 68 C35 75 42 75 50 75 C58 75 65 75 70 68 C75 58 70 50 65 45 C68 30 65 15 50 15 Z" fill={color} />
    {/* Central Lion Mane & Face Details */}
    <path d="M42 28 Q50 20 58 28 Q50 35 42 28 Z" fill="#0B2545" opacity="0.2" />
    <circle cx="44" cy="32" r="1.5" fill="#0B2545" />
    <circle cx="56" cy="32" r="1.5" fill="#0B2545" />
    <path d="M47 38 L53 38 L50 42 Z" fill="#0B2545" />
    {/* Crown / Top Abacus */}
    <path d="M45 12 H55 V15 H45 Z" fill={color} />
  </svg>
);

/**
 * Maharashtra Government Seal / Rajmudra SVG
 */
export const MaharashtraGovLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Octagonal Outer Ring */}
    <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#0B2545" stroke="#FF9933" strokeWidth="2.5" />
    {/* Inner Octagon */}
    <polygon points="32,9 68,9 91,32 91,68 68,91 32,91 9,68 9,32" fill="#0B2545" stroke="#138808" strokeWidth="1.5" />
    {/* Shivrajmudra Inscription Lines */}
    <rect x="25" y="28" width="50" height="3" fill="#FF9933" rx="1.5" />
    <rect x="20" y="40" width="60" height="3.5" fill="#FF9933" rx="1.5" />
    <rect x="22" y="53" width="56" height="3.5" fill="#FF9933" rx="1.5" />
    <rect x="28" y="66" width="44" height="3" fill="#FF9933" rx="1.5" />
    {/* Decorative Sun Rays */}
    <circle cx="50" cy="18" r="4" fill="#FF9933" />
    <path d="M50 78 L53 84 L47 84 Z" fill="#FF9933" />
  </svg>
);

/**
 * Kopargaon Municipal Council Official Emblem Crest SVG
 */
export const KopargaonCouncilLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crest Shield Background */}
    <path d="M50 5 L85 20 V50 C85 75 50 95 50 95 C50 95 15 75 15 50 V20 L50 5 Z" fill="#0B2545" stroke="#FF9933" strokeWidth="2.5" />
    {/* Inner Shield Divider (Tricolor Split) */}
    <path d="M50 12 L80 25 V48 C80 68 50 86 50 86 C50 86 20 68 20 48 V25 L50 12 Z" fill="#FFFFFF" opacity="0.95" />
    {/* Godavari River Waves in Center */}
    <path d="M22 55 Q35 48 50 55 T78 55" stroke="#0077B6" strokeWidth="4" fill="none" />
    <path d="M22 63 Q35 56 50 63 T78 63" stroke="#0096C7" strokeWidth="3" fill="none" />
    {/* Sun Rising (Energy & Growth) */}
    <path d="M35 42 A15 15 0 0 1 65 42 Z" fill="#FF9933" />
    {/* Temple / Municipal Gate Icon */}
    <path d="M42 22 H58 V35 H42 Z" fill="#0B2545" />
    <path d="M40 22 L50 14 L60 22 Z" fill="#138808" />
    <rect x="47" y="27" width="6" height="8" fill="#FFFFFF" />
  </svg>
);
