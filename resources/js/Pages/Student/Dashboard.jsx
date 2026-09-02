import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STATUS_STYLES = {
    paid: 'bg-green-100 text-green-700',
    not_paid: 'bg-red-100 text-red-700',
    remise: 'bg-amber-100 text-amber-700',
    free: 'bg-blue-100 text-blue-700',
};
const STATUS_LABELS = { paid: 'Paid', not_paid: 'Not paid', remise: 'Remise', free: 'Free' };

export default function Dashboard({ enrollments, recent_factures }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Student Dashboard</h2>}>
            <Head title="Student Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <p className="text-gray-700">Welcome, {auth.user.name}.</p>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800">My Schedule</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {enrollments.map((en) => (
                                <div key={en.id} className="p-6">
                                    <p className="font-medium text-gray-900">
                                        {en.groupe.matiere.name} — {en.groupe.niveau.label}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {en.groupe.teacher.first_name} {en.groupe.teacher.last_name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {en.groupe.schedules.map((s) => `${DAYS[s.day_of_week]} ${s.start_time.slice(0, 5)}-${s.end_time.slice(0, 5)}`).join(', ') || 'No schedule set'}
                                    </p>
                                </div>
                            ))}
                            {enrollments.length === 0 && (
                                <p className="p-6 text-sm text-gray-500">You're not enrolled in any groupe yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Factures</h3>
                            <Link href={route('student.factures.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                View all
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recent_factures.map((f) => (
                                <Link
                                    key={f.id}
                                    href={route('student.factures.show', f.id)}
                                    className="flex items-center justify-between p-6 hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {f.enrollment.groupe.matiere.name} — {f.enrollment.groupe.niveau.label}
                                        </p>
                                        <p className="text-sm text-gray-500">{f.period_start} → {f.period_end}</p>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[f.payment_status]}`}>
                                        {STATUS_LABELS[f.payment_status]}
                                    </span>
                                </Link>
                            ))}
                            {recent_factures.length === 0 && (
                                <p className="p-6 text-sm text-gray-500">No factures yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}