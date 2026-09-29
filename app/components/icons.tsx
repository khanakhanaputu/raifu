type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ScanIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3c2.5 3 4 5 4 7a4 4 0 01-8 0c0-.9.3-1.7.8-2.6C9.3 9.6 10.6 8.4 12 3z" />
      <path d="M7.5 12.5A6 6 0 0018 16a6 6 0 01-12 0c0-1.3.5-2.5 1.5-3.5z" />
    </svg>
  );
}

export function JournalIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 4.5A1.5 1.5 0 016.5 3H18a1 1 0 011 1v15a1 1 0 01-1 1H6.5A1.5 1.5 0 015 18.5z" />
      <path d="M5 16.5h14M9 7.5h6M9 11h4" />
    </svg>
  );
}

export function BowlIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 10.5h17a8.5 8.5 0 01-8.5 8 8.5 8.5 0 01-8.5-8z" />
      <path d="M9 7.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" />
      <path d="M2.5 21h19" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2l2.4 2.3 4.6-4.8" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h13M12.5 6l6 6-6 6" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 4c-8 0-13 3.6-13 9a5 5 0 005 5c5 0 8-5.7 8-14z" />
      <path d="M16 7c-3.6 2.2-6.4 5.9-8 11" />
    </svg>
  );
}

export function SaveIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v7M8.8 11.3L12 14.5l3.2-3.2" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M9 7V5h6v2M6.5 7l.8 12a1 1 0 001 .9h7.4a1 1 0 001-.9l.8-12" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

export function SnowflakeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      <path d="M12 6.4l2-1.6M12 6.4l-2-1.6M12 17.6l2 1.6M12 17.6l-2 1.6" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5L20 20" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8.5h2.8l1.3-2h7.8l1.3 2H20a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8a1 1 0 011-1z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 4h11a1 1 0 011 1v15l-6.5-4-6.5 4V5a1 1 0 011-1z" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="M3.8 6.5l8.2 6 8.2-6" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l7 2.5v5.8c0 4.2-2.9 7.6-7 9.2-4.1-1.6-7-5-7-9.2V5.5z" />
      <path d="M9.2 12.2l2 2 3.6-3.8" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.4 3.6-5.2 7-5.2s6.2 1.8 7 5.2" />
    </svg>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="10" cy="16" r="2" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 8.5a6 6 0 10-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z" />
      <path d="M10.3 19a2 2 0 003.4 0" />
    </svg>
  );
}

export function DeviceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="6" width="12" height="12" rx="1.5" />
      <rect x="16.5" y="9" width="4.5" height="9" rx="1" />
    </svg>
  );
}

export function RefreshIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12a8 8 0 0113.7-5.6L20 8.5M20 12a8 8 0 01-13.7 5.6L4 15.5" />
      <path d="M20 4v4.5h-4.5M4 20v-4.5h4.5" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
      <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </svg>
  );
}

export function DropletIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5s5.5 6 5.5 9.5a5.5 5.5 0 01-11 0C6.5 9.5 12 3.5 12 3.5z" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 16V5M8.2 8.8L12 5l3.8 3.8" />
      <path d="M4.5 15.5V18a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-2.5" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5.5h16a1 1 0 011 1v9a1 1 0 01-1 1h-9l-4.5 3.5V16.5H4a1 1 0 01-1-1v-9a1 1 0 011-1z" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 20H6a2 2 0 01-2-2V6a2 2 0 012-2h3" />
      <path d="M16 16l4-4-4-4M20 12H9" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 018 0v3" />
    </svg>
  );
}

export function TorchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M6 7v13M18 7v13M4.5 11h15" />
      <path d="M8.5 4.5h7" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 6.5c-1.6-1.2-3.8-1.7-6.5-1.5v13c2.7-.2 4.9.3 6.5 1.5 1.6-1.2 3.8-1.7 6.5-1.5v-13c-2.7-.2-4.9.3-6.5 1.5z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4v11M8 11.5l4 4 4-4" />
      <path d="M4.5 16v3a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-3" />
    </svg>
  );
}
