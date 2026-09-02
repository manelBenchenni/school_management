import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ sessions, date, rolePrefix }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Sessions</h2>}>
            <Head title="Sessions" />
            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => router.get(window.location.pathname, { date: e.target.value })}
                                className="rounded-md border-gray-300 shadow-sm text-sm"
                            />
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Groupe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Teacher</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {sessions.map((s) => (
                                    <tr key={s.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{s.groupe.matiere.name} — {s.groupe.niveau.label}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{s.groupe.teacher.first_name} {s.groupe.teacher.last_name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{s.status}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route(`${rolePrefix}.presence.scan`, s.id)} className="mr-4 text-indigo-600 hover:text-indigo-900">Scan</Link>
                                            <Link href={route(`${rolePrefix}.presence.show`, s.id)} className="text-indigo-600 hover:text-indigo-900">Mark Manually</Link>
                                        </td>
                                    </tr>
                                ))}
                                {sessions.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No sessions on this date.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}