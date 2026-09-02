import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ tarifs }) {
    const { flash } = usePage().props;

    const destroy = (tarif) => {
        if (!confirm(`Remove this tarif?`)) return;
        router.delete(route('admin.tarifs.destroy', tarif.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tarifs</h2>}>
            <Head title="Tarifs" />
            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{flash.error}</div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <p className="text-sm text-gray-500">One monthly price per teacher + matiere + niveau combo.</p>
                            <Link href={route('admin.tarifs.create')} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                + Add Tarif
                            </Link>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Teacher</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Matiere</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Niveau</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Monthly Price</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {tarifs.map((t) => (
                                    <tr key={t.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{t.teacher.first_name} {t.teacher.last_name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{t.matiere.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{t.niveau.label}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{t.monthly_price} DA</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link href={route('admin.tarifs.edit', t.id)} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link>
                                            <button onClick={() => destroy(t)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {tarifs.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No tarifs yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}