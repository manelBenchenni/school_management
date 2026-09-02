export default function Card({ children, className = '', padded = true }) {
    return (
        <div
            className={`rounded-2xl border border-slate-100 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] ${
                padded ? 'p-6' : ''
            } ${className}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, description, action }) {
    return (
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
    );
}
