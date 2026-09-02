import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ parent, students, attachedStudentIds }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: parent.first_name, last_name: parent.last_name,
        email: parent.user.email, phone: parent.user.phone || '', student_ids: attachedStudentIds,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.parents.update', parent.id));
    };

    const toggleStudent = (id) => {
        setData('student_ids', data.student_ids.includes(id) ? data.student_ids.filter((s) => s !== id) : [...data.student_ids, id]);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Edit Parent</h2>}>
            <Head title="Edit Parent" />
            <div className="mx-auto max-w-xl">
                <Card>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="first_name" value="First name" />
                            <TextInput id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} isFocused />
                            <InputError message={errors.first_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="last_name" value="Last name" />
                            <TextInput id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div>
                            <InputLabel value="Children" />
                            <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-3">
                                {students.map((s) => (
                                    <label key={s.id} className="flex items-center gap-2 py-1.5 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={data.student_ids.includes(s.id)}
                                            onChange={() => toggleStudent(s.id)}
                                            className="rounded-md border-slate-300 text-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30"
                                        />
                                        {s.first_name} {s.last_name}
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.student_ids} />
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                            <Link href={route('admin.users.index')}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
                            <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
