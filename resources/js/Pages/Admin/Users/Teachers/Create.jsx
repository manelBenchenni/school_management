import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import Card from '@/Components/Card';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ matieres }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        matiere_ids: [],
        percentage: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.teachers.store'));
    };

    const toggleMatiere = (id) => {
        setData('matiere_ids',
            data.matiere_ids.includes(id)
                ? data.matiere_ids.filter((m) => m !== id)
                : [...data.matiere_ids, id]
        );
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Add Teacher</h2>}>
            <Head title="Add Teacher" />
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
                            <InputLabel value="Matieres (can teach several)" />
                            <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-3">
                                {matieres.map((m) => (
                                    <label key={m.id} className="flex items-center gap-2 py-1.5 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={data.matiere_ids.includes(m.id)}
                                            onChange={() => toggleMatiere(m.id)}
                                            className="rounded-md border-slate-300 text-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30"
                                        />
                                        {m.name}
                                    </label>
                                ))}
                                {matieres.length === 0 && (
                                    <p className="text-sm text-slate-400">No matieres yet — add one first.</p>
                                )}
                            </div>
                            <InputError message={errors.matiere_ids} />
                        </div>

                        <div>
                            <InputLabel htmlFor="percentage" value="Percentage (%)" />
                            <TextInput id="percentage" type="number" step="0.01" min="0" max="100"
                                value={data.percentage} onChange={(e) => setData('percentage', e.target.value)} />
                            <p className="mt-1.5 text-xs text-slate-400">Can be changed later at any time.</p>
                            <InputError message={errors.percentage} />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <PasswordInput id="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                            <Link href={route('admin.users.index')}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
                            <PrimaryButton disabled={processing}>Add Teacher</PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
