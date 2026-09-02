export default function FlashBanner({ success, error }) {
    if (!success && !error) return null;
    return (
        <div className="mb-5 space-y-2">
            {success && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    {success}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                    {error}
                </div>
            )}
        </div>
    );
}
