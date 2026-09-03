import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import { ghostLinkClass } from '@/Components/linkStyles';
import { Head, Link } from '@inertiajs/react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const STATUS_TONE = {
    scheduled: 'blue',
    in_progress: 'amber',
    closed: 'slate',
    cancelled: 'red',
};

export default function Sessions({ groupe, sessions }) {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = sessions.filter((s) => s.date >= today);
    const past = sessions.filter((s) => s.date < today).reverse();

    const row = (s) => {
        const d = new Date(s.date + 'T00:00:00');
        return (
            <tr key={s.id} className="transition hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-800">{DAYS[d.getDay()]}, {s.date}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-500">{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</td>
                <td className="whitespace-nowrap px-6 py-3 text-sm">
                    <Badge tone={STATUS_TONE[s.status]}>{s.status.replace('_', ' ')}</Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-500">{s.presences_count}</td>
            </tr>
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Sessions — {groupe.name}</h2>}
        >
            <Head title={`Sessions - ${groupe.name}`} />

            <div className="mx-auto max-w-4xl">
                <Link href={route('admin.groupes.index')} className={ghostLinkClass}>← Back to Groupes</Link>

                <Card padded={false} className="mt-4">
                    <div className="border-b border-slate-100 p-6">
                        <h3 className="text-sm font-semibold text-slate-700">Upcoming ({upcoming.length})</h3>
                    </div>
                    {upcoming.length === 0 ? (
                        <p className="px-6 py-10 text-center text-sm text-slate-400">
                            No upcoming sessions generated yet. Go back and click "Generate Sessions".
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Marked</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">{upcoming.map(row)}</tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <Card padded={false} className="mt-6">
                    <div className="border-b border-slate-100 p-6">
                        <h3 className="text-sm font-semibold text-slate-700">Past ({past.length})</h3>
                    </div>
                    {past.length === 0 ? (
                        <p className="px-6 py-10 text-center text-sm text-slate-400">No past sessions yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="whitespace-nowrap px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Marked</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">{past.map(row)}</tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
