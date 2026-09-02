import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Groupes</h2>}>
            <Head title="Groupes" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{flash.error}</div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <PrimaryButton onClick={generateAll}>
                                Generate Next 30 Days (All Groupes)
                            </PrimaryButton>
                            <Link href={route('admin.groupes.create')} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                + Add Groupe
                            </Link>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Teacher</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Matiere</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Niveau</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Schedule</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Students</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {groupes.map((g) => (
                                    <tr key={g.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{g.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{g.teacher.first_name} {g.teacher.last_name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{g.matiere.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{g.niveau.label}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{scheduleSummary(g.schedules)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{g.enrollments_count}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <button
                                                onClick={() => toggleActive(g)}
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    g.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {g.active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route('admin.groupes.sessions', g.id)} className="mr-4 text-indigo-600 hover:text-indigo-900">
                                                View Sessions
                                            </Link>
                                            <button onClick={() => generateSessions(g)} className="mr-4 text-indigo-600 hover:text-indigo-900">
                                                Generate Sessions
                                            </button>
                                            <Link href={route('admin.groupes.edit', g.id)} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link>
                                            <button onClick={() => destroy(g)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {groupes.length === 0 && (
                                    <tr><td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">No groupes yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
