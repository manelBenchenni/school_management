// className strings for Inertia <Link> elements that should look like buttons/pills.
// Centralising these keeps every "+ Add" / "View" / "Edit" link visually consistent.

export const goldLinkClass =
    'inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#F7B94D] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-900/10 transition hover:from-[#E2960F] hover:to-[#F5A623]';

export const ghostLinkClass =
    'inline-flex items-center gap-1 text-sm font-medium text-[#2E86D8] hover:text-[#1B4F8C]';

export const dangerLinkClass = 'inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-800';

export const pillFilterClass = (active) =>
    `rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active ? 'bg-[#1B4F8C] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
    }`;
