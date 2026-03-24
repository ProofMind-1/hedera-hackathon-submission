import { FC } from "react";

export const LogoMark: FC<{ className?: string }> = ({ className }) => (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 112 113"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M56 10L18 26v26c0 23 16.8 44.5 38 49 21.2-4.5 38-26 38-49V26L56 10z"
      fill="#4F46E5"
    />
    <path
      d="M56 10L18 26v26c0 23 16.8 44.5 38 49 21.2-4.5 38-26 38-49V26L56 10z"
      fill="url(#pmLogoGradient)"
      style={{ mixBlendMode: "screen" }}
    />
    <path
      d="M40 57l12 12 22-24"
      stroke="white"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="pmLogoGradient" x1="18" y1="10" x2="94" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A5B4FC" />
        <stop offset="0.4" stopColor="#818CF8" />
        <stop offset="1" stopColor="#3730A3" />
      </linearGradient>
    </defs>
  </svg>
);
