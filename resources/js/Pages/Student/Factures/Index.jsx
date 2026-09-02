import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const STATUS_STYLES = {
    paid: 'bg-green-100 text-green-700',
    not_paid: 'bg-red-100 text-red-700',
    remise: 'bg-amber-100 text-amber-700',
    free: 'bg-blue-100 text-blue-700',
};
const STATUS_LABELS = { paid: 'Paid', not_paid: 'Not paid', remise: 'Remise', free: 'Free' };

export default function Index({ factures }) {
    const rows = factures.data;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Factures</h2>}>
            <Head title="My Factures" />
            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Groupe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Period</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount Due</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {rows.map((f) => (
                                    <tr key={f.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                            {f.enrollment.groupe.matiere.name} — {f.enrollment.groupe.niveau.label}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{f.period_start} → {f.period_end}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[f.payment_status]}`}>
                                                {STATUS_LABELS[f.payment_status]}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{f.amount_due} DA</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route('student.factures.show', f.id)} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No factures yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}