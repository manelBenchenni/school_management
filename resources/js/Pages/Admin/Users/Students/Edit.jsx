import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import { ghostLinkClass } from '@/Components/linkStyles';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ student, niveaux }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: student.first_name, last_name: student.last_name,
        email: student.user.email, phone: student.user.phone || '',
        niveau_id: student.niveau_id, photo: null, _method: 'put',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.students.update', student.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Edit Student</h2>}>
            <Head title="Edit Student" />
            <div className="mx-auto max-w-xl">
                <Card>
                    <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-5">
                        <p className="text-xs font-medium text-slate-400">Barcode: {student.barcode}</p>
                        <a href={route('admin.students.card', student.id)} target="_blank" rel="noopener noreferrer" className={ghostLinkClass}>
                            Print ID Card →
                        </a>
                    </div>

                    {student.photo_path && (
                        <img src={`/storage/${student.photo_path}`} alt="Current photo" className="mb-5 h-24 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
                    )}

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
                                {niveaux.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
                            </SelectInput>
                            <InputError message={errors.niveau_id} />
                        </div>
                        <div>
                            <InputLabel htmlFor="photo" value="Replace photo (optional)" />
                            <input id="photo" type="file" accept="image/*" onChange={(e) => setData('photo', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF3FC] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1B4F8C] hover:file:bg-[#DCEBFA]" />
                            <InputError message={errors.photo} />
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
