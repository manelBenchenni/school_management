import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ staff }) {
    const { data, setData, put, processing, errors } = useForm({
        name: staff.name, email: staff.email, phone: staff.phone || '', role: staff.role,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.staff.update', staff.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Edit Staff Account</h2>}>
            <Head title="Edit Staff" />
            <div className="mx-auto max-w-xl">
                <Card>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Full name" />
                            <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} isFocused />
                            <InputError message={errors.name} />
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
                            <InputLabel htmlFor="role" value="Role" />
                            <SelectInput id="role" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                                <option value="admin">Admin</option>
                                <option value="reception">Reception</option>
                            </SelectInput>
                            <InputError message={errors.role} />
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
