import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FlashBanner from '@/Components/FlashBanner';
import { goldLinkClass, ghostLinkClass, dangerLinkClass } from '@/Components/linkStyles';
import { Head, Link, router, usePage } from '@inertiajs/react';

const CYCLE_LABELS = { primaire: 'Primaire', moyen: 'Moyen', lycee: 'Lycee' };

export default function Index({ niveaux }) {
    const { flash } = usePage().props;

    const destroy = (niveau) => {
        if (!confirm(`Remove "${niveau.label}"?`)) return;
        router.delete(route('admin.niveaux.destroy', niveau.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Niveaux</h2>}>
            <Head title="Niveaux" />
            <div className="mx-auto max-w-4xl">
                <FlashBanner success={flash?.success} error={flash?.error} />

                <Card padded={false}>
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <p className="text-sm text-slate-500">Primaire (5 years), Moyen (4 years), Lycee (3 years).</p>
                        <Link href={route('admin.niveaux.create')} className={goldLinkClass}>+ Add Niveau</Link>
                    </div>

                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cycle</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Label</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Students</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {niveaux.map((n) => (
                                <tr key={n.id} className="transition hover:bg-slate-50/60">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{CYCLE_LABELS[n.cycle]}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{n.year}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{n.label}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{n.students_count}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link href={route('admin.niveaux.edit', n.id)} className={ghostLinkClass}>Edit</Link>
                                            <button onClick={() => destroy(n)} className={dangerLinkClass}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {niveaux.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">No niveaux yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
