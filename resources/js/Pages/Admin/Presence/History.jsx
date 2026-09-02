import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const STATUS_STYLES = {
    scheduled: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-700',
    closed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function History({ groupe, sessions, rolePrefix }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{groupe.name} — History</h2>}>
            <Head title={`${groupe.name} History`} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-4 rounded-md bg-white p-4 text-sm text-gray-500 shadow-sm">
                        {groupe.matiere.name} — {groupe.niveau.label} — {groupe.teacher.first_name} {groupe.teacher.last_name}
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Present</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Absent</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {sessions.map((s) => (
                                    <tr key={s.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{s.date}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-green-700">{s.present_count}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-red-700">{s.absent_count}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route(`${rolePrefix}.presence.show`, s.id)} className="text-indigo-600 hover:text-indigo-900">Details</Link>
                                        </td>
                                    </tr>
                                ))}
                                {sessions.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No sessions generated yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}