import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Card, { CardHeader } from '@/Components/Card';
import FlashBanner from '@/Components/FlashBanner';
import { ghostLinkClass } from '@/Components/linkStyles';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Enroll({ student, groupes, currentEnrollments }) {
    const { flash } = usePage().props;
    const [groupeId, setGroupeId] = useState('');

    const enroll = (e) => {
        e.preventDefault();
        if (!groupeId) return;
        router.post(route('admin.students.enroll.store', student.id), { groupe_id: groupeId }, {
            onSuccess: () => setGroupeId(''),
        });
    };

    const leave = (enrollment) => {
        if (!confirm('Remove this student from the groupe?')) return;
        router.delete(route('admin.students.enroll.destroy', [student.id, enrollment.id]));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                    Groupes for {student.first_name} {student.last_name}
                </h2>
            }
        >
            <Head title="Manage Groupes" />

            <div className="mx-auto max-w-xl">
                <FlashBanner success={flash?.success} error={flash?.error} />

                <Card className="mb-6">
                    <CardHeader title="Current groupes" />
                    {currentEnrollments.length === 0 && <p className="text-sm text-slate-400">Not enrolled in any groupe yet.</p>}
                    <ul className="divide-y divide-slate-100">
                        {currentEnrollments.map((e) => (
                            <li key={e.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{e.groupe.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {e.groupe.matiere.name} · {e.groupe.teacher.first_name} {e.groupe.teacher.last_name}
                                    </p>
                                </div>
                                <button onClick={() => leave(e)} className="text-sm font-medium text-rose-600 hover:text-rose-800">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <CardHeader title="Enroll in a new groupe" />
                    <form onSubmit={enroll} className="flex gap-2">
                        <select
                            value={groupeId}
                            onChange={(e) => setGroupeId(e.target.value)}
                            className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30"
                        >
                            <option value="">Select a groupe</option>
                            {groupes.map((g) => (
                                <option key={g.id} value={g.id}>{g.name} — {g.matiere.name} ({g.niveau.label})</option>
                            ))}
                        </select>
                        <PrimaryButton disabled={!groupeId}>Enroll</PrimaryButton>
                    </form>
                    {groupes.length === 0 && <p className="mt-2 text-xs text-slate-400">No other active groupes available to join.</p>}
                </Card>

                <div className="mt-6">
                    <Link href={route('admin.users.index')} className={ghostLinkClass}>← Back to Users</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
