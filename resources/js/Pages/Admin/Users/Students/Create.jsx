import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ niveaux }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '', last_name: '', email: '', phone: '', niveau_id: '', password: '', photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.students.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Add Student</h2>}>
            <Head title="Add Student" />
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
                            <InputLabel htmlFor="niveau_id" value="Niveau" />
                            <SelectInput id="niveau_id" value={data.niveau_id} onChange={(e) => setData('niveau_id', e.target.value)}>
                                <option value="">Select a niveau</option>
                                {niveaux.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
                            </SelectInput>
                            <InputError message={errors.niveau_id} />
                        </div>
                        <div>
                            <InputLabel htmlFor="photo" value="Photo (for ID card)" />
                            <input id="photo" type="file" accept="image/*" onChange={(e) => setData('photo', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF3FC] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1B4F8C] hover:file:bg-[#DCEBFA]" />
                            <InputError message={errors.photo} />
                        </div>
                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <InputError message={errors.password} />
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                            <Link href={route('admin.users.index')}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
                            <PrimaryButton disabled={processing}>Add Student</PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
