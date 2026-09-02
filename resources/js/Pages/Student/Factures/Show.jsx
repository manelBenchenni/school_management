import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const STATUS_LABELS = { paid: 'Paid', not_paid: 'Not paid', remise: 'Remise', free: 'Free' };

export default function Show({ facture, sessions_used, sessions_remaining }) {
    const { enrollment } = facture;
    const groupe = enrollment.groupe;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Facture #{facture.id}</h2>}>
            <Head title={`Facture #${facture.id}`} />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-8 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {groupe.matiere.name} — {groupe.niveau.label}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {groupe.teacher.first_name} {groupe.teacher.last_name}
                        </p>

                        <dl className="mt-6 divide-y divide-gray-100 text-sm">
                            <div className="flex justify-between py-2">
                                <dt className="text-gray-500">Period</dt>
                                <dd className="text-gray-900">{facture.period_start} → {facture.period_end}</dd>
                            </div>
                            <div className="flex justify-between py-2">
                                <dt className="text-gray-500">Status</dt>
                                <dd className="text-gray-900">{STATUS_LABELS[facture.payment_status]}</dd>
                            </div>
                            <div className="flex justify-between py-2">
                                <dt className="text-gray-500">Sessions paid</dt>
                                <dd className="text-gray-900">{facture.sessions_paid}</dd>
                            </div>
                            <div className="flex justify-between py-2">
                                <dt className="text-gray-500">Sessions used</dt>
                                <dd className="text-gray-900">{sessions_used}</dd>
                            </div>
                            <div className="flex justify-between py-2">
                                <dt className="text-gray-500">Sessions remaining</dt>
                                <dd className="text-gray-900">{sessions_remaining}</dd>
                            </div>
                            <div className="flex justify-between py-2 font-semibold">
                                <dt className="text-gray-700">Amount due</dt>
                                <dd className="text-gray-900">{facture.amount_due} DA</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}