import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ tarif, teachers, matieres, niveaux }) {
    const { data, setData, put, processing, errors } = useForm({
        teacher_id: tarif.teacher_id,
        matiere_id: tarif.matiere_id,
        niveau_id: tarif.niveau_id,
        monthly_price: tarif.monthly_price,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.tarifs.update', tarif.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Tarif</h2>}>
            <Head title="Edit Tarif" />
            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6 bg-white p-6 shadow-sm sm:rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teacher</label>
                            <select value={data.teacher_id} onChange={(e) => setData('teacher_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {teachers.map((t) => (
                                    <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                ))}
                            </select>
                            {errors.teacher_id && <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Matiere</label>
                            <select value={data.matiere_id} onChange={(e) => setData('matiere_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {matieres.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            {errors.matiere_id && <p className="mt-1 text-sm text-red-600">{errors.matiere_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Niveau</label>
                            <select value={data.niveau_id} onChange={(e) => setData('niveau_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {niveaux.map((n) => (
                                    <option key={n.id} value={n.id}>{n.label}</option>
                                ))}
                            </select>
                            {errors.niveau_id && <p className="mt-1 text-sm text-red-600">{errors.niveau_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly price (DA)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.monthly_price}
                                onChange={(e) => setData('monthly_price', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            {errors.monthly_price && <p className="mt-1 text-sm text-red-600">{errors.monthly_price}</p>}
                        </div>

                        <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}