import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FlashBanner from '@/Components/FlashBanner';
import { goldLinkClass, ghostLinkClass, dangerLinkClass } from '@/Components/linkStyles';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ matieres }) {
    const { flash } = usePage().props;

    const destroy = (matiere) => {
        if (!confirm(`Remove "${matiere.name}"?`)) return;
        router.delete(route('admin.matieres.destroy', matiere.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Matieres</h2>}>
            <Head title="Matieres" />
            <div className="mx-auto max-w-4xl">
                <FlashBanner success={flash?.success} error={flash?.error} />

                <Card padded={false}>
                    <div className="flex items-center justify-end border-b border-slate-100 p-6">
                        <Link href={route('admin.matieres.create')} className={goldLinkClass}>+ Add Matiere</Link>
                    </div>

                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Teachers</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Groupes</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {matieres.map((m) => (
                                <tr key={m.id} className="transition hover:bg-slate-50/60">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{m.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{m.teachers_count}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{m.groupes_count}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link href={route('admin.matieres.edit', m.id)} className={ghostLinkClass}>Edit</Link>
                                            <button onClick={() => destroy(m)} className={dangerLinkClass}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {matieres.length === 0 && (
                                <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">No matieres yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
