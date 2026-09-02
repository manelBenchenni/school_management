import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import Card from '@/Components/Card';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Create({ students }) {
    const [studentId, setStudentId] = useState('');
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        enrollment_id: '',
        period_start: new Date().toISOString().slice(0, 10),
        payment_status: 'paid',
        remise_percent: '',
    });

    const student = students.find((s) => String(s.id) === studentId);
    const enrollments = student?.enrollments ?? [];

    useEffect(() => {
        if (!data.enrollment_id || !data.period_start) {
            setPreview(null);
            return;
        }
        axios.post(route('admin.factures.preview'), {
            enrollment_id: data.enrollment_id,
            period_start: data.period_start,
        }).then((res) => setPreview(res.data));
    }, [data.enrollment_id, data.period_start]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.factures.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">New Facture</h2>}>
            <Head title="New Facture" />
            <div className="mx-auto max-w-2xl">
                <Card>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel value="Student" />
                            <select
                                value={studentId}
                                onChange={(e) => {
                                    setStudentId(e.target.value);
                                    setData('enrollment_id', '');
                                }}
                                className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30"
                            >
                                <option value="">Select a student</option>
                                {students.map((s) => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                            </select>
                        </div>

                        {student && (
                            <div>
                                <InputLabel value="Groupe" />
                                <SelectInput value={data.enrollment_id} onChange={(e) => setData('enrollment_id', e.target.value)}>
                                    <option value="">Select a groupe</option>
                                    {enrollments.map((en) => (
                                        <option key={en.id} value={en.id}>
                                            {en.groupe.matiere.name} — {en.groupe.niveau.label} — {en.groupe.teacher.first_name} {en.groupe.teacher.last_name}
                                        </option>
                                    ))}
                                </SelectInput>
                                {errors.enrollment_id && <p className="mt-1.5 text-sm font-medium text-rose-600">{errors.enrollment_id}</p>}
                            </div>
                        )}

                        <div>
                            <InputLabel value="Period start" />
                            <input
                                type="date"
                                value={data.period_start}
                                onChange={(e) => setData('period_start', e.target.value)}
                                className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30"
                            />
                            <p className="mt-1.5 text-xs text-slate-400">Usually today, but can be backdated or postdated to match when the student actually pays.</p>
                        </div>

                       {preview && (
    <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
        <p>Period: <strong>{data.period_start}</strong> → <strong>{preview.period_end}</strong></p>
        <p>Sessions in this period: <strong>{preview.sessions_paid}</strong></p>
        <p>Base price: <strong>{preview.base_amount} DA</strong> ({preview.session_price} DA/session)</p>
        {preview.base_amount == 0 && (
            <p className="mt-1 text-amber-600">No tarif set for this teacher/matiere/niveau combo yet.</p>
        )}
    </div>
)}

                        <div>
                            <InputLabel value="Payment status" />
                            <SelectInput value={data.payment_status} onChange={(e) => setData('payment_status', e.target.value)}>
                                <option value="paid">Paid</option>
                                <option value="not_paid">Not paid</option>
                                <option value="remise">Remise (discount)</option>
                                <option value="free">Free</option>
                            </SelectInput>
                        </div>

                        {data.payment_status === 'remise' && (
                            <div>
                                <InputLabel value="Remise %" />
                                <input
                                    type="number" min="0" max="100"
                                    value={data.remise_percent}
                                    onChange={(e) => setData('remise_percent', e.target.value)}
                                    className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30"
                                />
                            </div>
                        )}

                        <div className="border-t border-slate-100 pt-5">
                            <PrimaryButton disabled={processing}>Create Facture</PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
