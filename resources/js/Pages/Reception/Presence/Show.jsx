import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ session, roster, rolePrefix }) {
    const { flash } = usePage().props;
    const [statuses, setStatuses] = useState(
        Object.fromEntries(roster.map((s) => [s.id, s.status ?? 'present']))
    );

    const setStatus = (studentId, status) => {
        setStatuses((prev) => ({ ...prev, [studentId]: status }));
    };

    const submit = () => {
        router.post(route(`${rolePrefix}.presence.store`, session.id), {
            statuses: Object.entries(statuses).map(([student_id, status]) => ({ student_id: Number(student_id), status })),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Mark Presence</h2>}>
            <Head title="Mark Presence" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                    )}

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <p className="text-sm text-gray-500">
                            {session.groupe.matiere.name} — {session.groupe.niveau.label} — {session.date} {session.start_time.slice(0, 5)}
                        </p>

                        <div className="mt-6 divide-y divide-gray-100">
                            {roster.map((s) => (
                                <div key={s.id} className="flex items-center justify-between py-3">
                                    <span className="text-sm text-gray-900">{s.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setStatus(s.id, 'present')}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statuses[s.id] === 'present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            Present
                                        </button>
                                        <button
                                            onClick={() => setStatus(s.id, 'absent')}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statuses[s.id] === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {roster.length === 0 && (
                                <p className="py-8 text-center text-sm text-gray-500">No students enrolled in this groupe.</p>
                            )}
                        </div>

                        {roster.length > 0 && (
                            <div className="mt-6">
                                <PrimaryButton onClick={submit}>Save</PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}