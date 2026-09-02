// Small dependency-free icon set (stroke-based, 24x24) used across the app.
// Kept as one file so the sidebar/topbar/cards can share a single visual language.

const base = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export function HomeIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
        </svg>
    );
}

export function UsersIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <circle cx="9" cy="8" r="3" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
            <circle cx="17.5" cy="9" r="2.5" />
            <path d="M15.8 14.2c2.7.4 4.7 2.4 4.7 5.3" />
        </svg>
    );
}

export function GroupIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    );
}

export function BookIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
            <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5A1.5 1.5 0 0 0 20 18.5v-13Z" />
        </svg>
    );
}

export function LayersIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M12 3 2.5 8 12 13l9.5-5L12 3Z" />
            <path d="m2.5 13 9.5 5 9.5-5" />
            <path d="m2.5 10.5 9.5 5 9.5-5" />
        </svg>
    );
}

export function CashIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <rect x="2.5" y="6" width="19" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.8" />
            <path d="M6 6v12M18 6v12" />
        </svg>
    );
}

export function CalendarIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 9.5h18M8 3v4M16 3v4" />
        </svg>
    );
}

export function LogoutIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
            <path d="M15 16l4-4-4-4M19 12H9" />
        </svg>
    );
}

export function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M3.5 6h17M3.5 12h17M3.5 18h17" />
        </svg>
    );
}

export function CloseIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M5 5l14 14M19 5 5 19" />
        </svg>
    );
}

export function ChevronDownIcon(props) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export function StarIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
            <path d="M12 2.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 2.5Z" />
        </svg>
    );
}
