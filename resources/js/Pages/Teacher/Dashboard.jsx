import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage ,Link} from '@inertiajs/react';

const STATUS_STYLES = {
    paid: 'bg-green-100 text-green-700',
    not_paid: 'bg-red-100 text-red-700',
    remise: 'bg-amber-100 text-amber-700',
    free: 'bg-blue-100 text-blue-700',
};
const STATUS_LABELS = { paid: 'Paid', not_paid: 'Not paid', remise: 'Remise', free: 'Free' };

export default function Dashboard({ groupes, percentage, grand_total, teacher_share }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Teacher Dashboard</h2>}>
            <Head title="Teacher Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <p className="text-gray-700">Welcome, {auth.user.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Total Collected</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-800">{grand_total} DA</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Your Percentage</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-800">{percentage}%</p>
                        </div>
                        <div className="rounded-lg bg-indigo-600 p-6 shadow-sm">
                            <p className="text-sm text-indigo-100">Your Share</p>
                            <p className="mt-1 text-2xl font-semibold text-white">{teacher_share} DA</p>
                        </div>
                    </div>

                    {groupes.map((g) => (
                        <div key={g.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center justify-between border-b border-gray-100 p-6">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{g.name}</p>
                                    <Link href={route('teacher.groupes.history', g.id)} className="text-sm text-indigo-600 hover:text-indigo-900">
    View History
</Link>
                                    <p className="text-sm text-gray-500">{g.matiere} — {g.niveau}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-700">Collected: {g.groupe_total} DA</p>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Payment Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {g.students.map((s) => (
                                        <tr key={s.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{s.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[s.payment_status]}`}>
                                                    {STATUS_LABELS[s.payment_status]}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{s.amount_due} DA</td>
                                        </tr>
                                    ))}
                                    {g.students.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">No students enrolled.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {groupes.length === 0 && (
                        <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                            You have no groupes assigned yet.
                        </div>

                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}