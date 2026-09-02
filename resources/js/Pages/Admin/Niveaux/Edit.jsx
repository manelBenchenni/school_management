import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ niveau }) {
    const { data, setData, put, processing, errors } = useForm({
        cycle: niveau.cycle,
        year: niveau.year,
        label: niveau.label,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.niveaux.update', niveau.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Edit Niveau</h2>}>
            <Head title="Edit Niveau" />
            <div className="mx-auto max-w-xl">
                <Card>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="cycle" value="Cycle" />
                            <SelectInput id="cycle" value={data.cycle} onChange={(e) => setData('cycle', e.target.value)}>
                                <option value="primaire">Primaire (5 years)</option>
                                <option value="moyen">Moyen (4 years)</option>
                                <option value="lycee">Lycee (3 years)</option>
                            </SelectInput>
                            <InputError message={errors.cycle} />
                        </div>

                        <div>
                            <InputLabel htmlFor="year" value="Year" />
                            <TextInput id="year" type="number" min="1" max="5" value={data.year} onChange={(e) => setData('year', e.target.value)} />
                            <InputError message={errors.year} />
                        </div>

                        <div>
                            <InputLabel htmlFor="label" value="Label" />
                            <TextInput id="label" value={data.label} onChange={(e) => setData('label', e.target.value)} />
                            <InputError message={errors.label} />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                            <Link href={route('admin.niveaux.index')}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
                            <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
