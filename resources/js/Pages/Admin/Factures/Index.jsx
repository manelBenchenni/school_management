import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import FlashBanner from '@/Components/FlashBanner';
import { goldLinkClass, ghostLinkClass } from '@/Components/linkStyles';

const STATUS_TONE = { paid: 'green', not_paid: 'red', remise: 'amber', free: 'blue' };
const STATUS_LABELS = { paid: 'Paid', not_paid: 'Not paid', remise: 'Remise', free: 'Free' };

export default function Index({ factures }) {
    const { flash } = usePage().props;
    const rows = factures.data;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Factures</h2>}>
            <Head title="Factures" />
            <div className="mx-auto max-w-6xl">
                <FlashBanner success={flash?.success} />

                <Card padded={false}>
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <p className="text-sm text-slate-500">Payments per student enrollment.</p>
                        <Link href={route('admin.factures.create')} className={goldLinkClass}>+ New Facture</Link>
                    </div>

                    {/* Fix: horizontal scroll region for the table itself, rather
                        than letting the card's rounded corners clip it. */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Groupe</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Period</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Amount Due</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {rows.map((f) => (
                                    <tr key={f.id} className="transition hover:bg-slate-50/60">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                                            {f.enrollment.student.first_name} {f.enrollment.student.last_name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                            {f.enrollment.groupe.matiere.name} — {f.enrollment.groupe.niveau.label}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{f.period_start} → {f.period_end}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <Badge tone={STATUS_TONE[f.payment_status]}>{STATUS_LABELS[f.payment_status]}</Badge>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">{f.amount_due} DA</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route('admin.factures.show', f.id)} className={ghostLinkClass}>View</Link>
                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">No factures yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
