const TONES = {
    green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    red: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    blue: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
    slate: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
    yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200',
};

export default function Badge({ tone = 'slate', children }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone] || TONES.slate}`}>
            {children}
        </span>
    );
}
