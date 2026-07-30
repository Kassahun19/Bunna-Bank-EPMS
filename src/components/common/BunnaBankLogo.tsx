import React from 'react';

interface BunnaBankLogoProps {
  className?: string;
  variant?: 'maroon' | 'gold' | 'white' | 'dual';
  badgeBackground?: boolean;
}

export const BunnaBankLogo: React.FC<BunnaBankLogoProps> = ({
  className = "w-10 h-10",
  variant = 'maroon',
  badgeBackground = false
}) => {
  // Color palette selection
  // Maroon: #58181A (authentic Bunna Bank brand maroon/burgundy)
  // Gold: #D4AF37 (EPMS gold)
  let mainColor = "#58181A";
  let cutoutColor = "#FFFFFF";

  if (variant === 'gold') {
    mainColor = "#D4AF37";
    cutoutColor = "#0B4228"; // Dark green cutout for header integration
  } else if (variant === 'white') {
    mainColor = "#FFFFFF";
    cutoutColor = "#0B4228";
  } else if (variant === 'dual') {
    mainColor = "#58181A";
    cutoutColor = "#F9F6EE";
  }

  const svgContent = (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main Base Circle */}
      <circle cx="50" cy="50" r="48" fill={mainColor} />

      {/* Upper Central Arch / Dome Cutout */}
      <path
        d="M 30 57 L 30 42 A 20 20 0 0 1 70 42 L 70 57 Z"
        fill={cutoutColor}
      />

      {/* Curved Separator Ribbon with Notched End Tabs */}
      <path
        d="M 6 62 
           C 25 68 75 68 94 62 
           L 91 67 
           C 73 73 27 73 9 67 
           L 6 62 Z"
        fill={cutoutColor}
      />
    </svg>
  );

  if (badgeBackground) {
    return (
      <div className={`rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B38F24] to-[#0B4228] p-0.5 shadow-md flex items-center justify-center shrink-0 ${className}`}>
        <div className="w-full h-full bg-[#0B4228] rounded-[10px] p-1 flex items-center justify-center">
          {svgContent}
        </div>
      </div>
    );
  }

  return <div className={`shrink-0 flex items-center justify-center ${className}`}>{svgContent}</div>;
};
