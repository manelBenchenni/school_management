import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
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
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Add Teacher</h2>}
        >
            <Head title="Add Teacher" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="first_name" value="First name" />
                                <TextInput id="first_name" className="mt-1 block w-full" value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)} isFocused />
                                <InputError message={errors.first_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="last_name" value="Last name" />
                                <TextInput id="last_name" className="mt-1 block w-full" value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)} />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email}
                                    onChange={(e) => setData('email', e.target.value)} />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Phone" />
                                <TextInput id="phone" className="mt-1 block w-full" value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)} />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Matieres (can teach several)" />
                                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 p-3">
                                    {matieres.map((m) => (
                                        <label key={m.id} className="flex items-center gap-2 py-1 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={data.matiere_ids.includes(m.id)}
                                                onChange={() => toggleMatiere(m.id)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            {m.name}
                                        </label>
                                    ))}
                                    {matieres.length === 0 && (
                                        <p className="text-sm text-gray-400">No matieres yet — add one first.</p>
                                    )}
                                </div>
                                <InputError message={errors.matiere_ids} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="percentage" value="Percentage (%)" />
                                <TextInput id="percentage" type="number" step="0.01" min="0" max="100"
                                    className="mt-1 block w-full" value={data.percentage}
                                    onChange={(e) => setData('percentage', e.target.value)} />
                                <p className="mt-1 text-xs text-gray-400">Can be changed later at any time.</p>
                                <InputError message={errors.percentage} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput id="password" type="password" className="mt-1 block w-full" value={data.password}
                                    onChange={(e) => setData('password', e.target.value)} />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-2">
                                <Link href={route('admin.users.index')} className="text-sm text-gray-600 underline">Cancel</Link>
                                <PrimaryButton disabled={processing}>Add Teacher</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
