import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';

const STATUS_LABELS = { paid: 'Paid', not_paid: 'Not paid', remise: 'Remise', free: 'Free' };
const STATUS_TONE = { paid: 'green', not_paid: 'red', remise: 'amber', free: 'blue' };

function Row({ label, value, strong }) {
    return (
        <div className="flex justify-between py-2.5 text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className={strong ? 'font-semibold text-slate-900' : 'text-slate-800'}>{value}</dd>
        </div>
    );
}

export default function Show({ facture, sessions_used, sessions_remaining, session_price }) {
    const { enrollment } = facture;
    const student = enrollment.student;
    const groupe = enrollment.groupe;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Facture #{facture.id}</h2>}>
            <Head title={`Facture #${facture.id}`} />
            <div className="mx-auto max-w-2xl">
                <div className="mb-4 flex justify-end print:hidden">
                    <a
                        href={route('admin.factures.pdf', facture.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2E86D8] to-[#3E9BE8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#2874BD] hover:to-[#2E86D8]"
                    >
                        Download PDF
                    </a>
                </div>

                <Card>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">{student.first_name} {student.last_name}</h3>
                            <p className="text-sm text-slate-500">
                                {groupe.matiere.name} — {groupe.niveau.label} — {groupe.teacher.first_name} {groupe.teacher.last_name}
                            </p>
                        </div>
                        <Badge tone={STATUS_TONE[facture.payment_status]}>{STATUS_LABELS[facture.payment_status]}</Badge>
                    </div>

                    <dl className="mt-6 divide-y divide-slate-100">
                        <Row label="Period" value={`${facture.period_start} → ${facture.period_end}`} />
                        <Row label="Sessions paid" value={facture.sessions_paid} />
                        <Row label="Sessions used" value={sessions_used} />
                        <Row label="Sessions remaining" value={sessions_remaining} />
                        <Row label="Base amount" value={`${facture.base_amount} DA`} />
                        {facture.remise_percent && <Row label="Remise" value={`${facture.remise_percent}%`} />}
                        <Row label="Amount due" value={`${facture.amount_due} DA`} strong />
                        <div className="flex justify-between py-2">
    <dt className="text-gray-500">Base amount</dt>
    <dd className="text-gray-900">{facture.base_amount} DA</dd>
</div>
<div className="flex justify-between py-2">
    <dt className="text-gray-500">Price per session</dt>
    <dd className="text-gray-900">{session_price} DA</dd>
</div>
                    </dl>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
