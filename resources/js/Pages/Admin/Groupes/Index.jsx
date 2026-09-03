import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import FlashBanner from '@/Components/FlashBanner';
import { goldLinkClass, ghostLinkClass } from '@/Components/linkStyles';
import { Head, Link, router, usePage } from '@inertiajs/react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function scheduleSummary(schedules) {
    if (!schedules || schedules.length === 0) return '—';
    return schedules
        .map((s) => `${DAYS[s.day_of_week]} ${s.start_time.slice(0, 5)}-${s.end_time.slice(0, 5)}`)
        .join(', ');
}

export default function Index({ groupes }) {
    const { flash } = usePage().props;

    const destroy = (groupe) => {
        if (!confirm(`Remove "${groupe.name}"?`)) return;
        router.delete(route('admin.groupes.destroy', groupe.id));
    };

    const toggleActive = (groupe) => {
        router.patch(route('admin.groupes.toggle-active', groupe.id));
    };

    const generateSessions = (groupe) => {
        router.post(route('admin.groupes.generate-sessions', groupe.id), { days: 30 });
    };

    const generateAll = () => {
        if (!confirm('Generate the next 30 days of sessions for every active groupe?')) return;
        router.post(route('admin.groupes.generate-sessions-all'), { days: 30 });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Groupes</h2>}>
            <Head title="Groupes" />
            <div className="mx-auto max-w-7xl">
                <FlashBanner success={flash?.success} error={flash?.error} />

                <Card padded={false}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                        <PrimaryButton onClick={generateAll}>
                            Generate Next 30 Days (All Groupes)
                        </PrimaryButton>
                        <Link href={route('admin.groupes.create')} className={goldLinkClass}>+ Add Groupe</Link>
                    </div>

                    {/* Fix: table gets its own horizontal scroll region instead of
                        being silently clipped by the card's rounded corners. */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Matiere</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Niveau</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Schedule</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Students</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {groupes.map((g) => (
                                    <tr key={g.id} className="transition hover:bg-slate-50/60">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{g.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{g.teacher.first_name} {g.teacher.last_name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{g.matiere.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{g.niveau.label}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{scheduleSummary(g.schedules)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{g.enrollments_count}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <button onClick={() => toggleActive(g)}>
                                                <Badge tone={g.active ? 'green' : 'slate'}>{g.active ? 'Active' : 'Inactive'}</Badge>
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route('admin.groupes.sessions', g.id)} className={`${ghostLinkClass} mr-4`}>Sessions</Link>
                                            <button onClick={() => generateSessions(g)} className="mr-4 text-sm font-medium text-[#2E86D8] hover:text-[#1B4F8C]">
                                                Generate
                                            </button>
                                            <Link href={route('admin.groupes.edit', g.id)} className={`${ghostLinkClass} mr-4`}>Edit</Link>
                                            <button onClick={() => destroy(g)} className="text-sm font-medium text-rose-600 hover:text-rose-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {groupes.length === 0 && (
                                    <tr><td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">No groupes yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
