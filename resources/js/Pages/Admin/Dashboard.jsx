import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { UsersIcon, GroupIcon, BookIcon, LayersIcon, CashIcon, CalendarIcon } from '@/Components/Icons';

const LINKS = [
    { href: 'admin.users.index', label: 'Users', description: 'Students, teachers, parents, reception, admin', icon: UsersIcon },
    { href: 'admin.groupes.index', label: 'Groupes', description: 'Classes, teachers, schedules', icon: GroupIcon },
    { href: 'admin.matieres.index', label: 'Matieres', description: 'Subjects taught', icon: BookIcon },
    { href: 'admin.niveaux.index', label: 'Niveaux', description: 'Primaire, moyen, lycee levels', icon: LayersIcon },
    { href: 'admin.tarifs.index', label: 'Tarifs', description: 'Monthly prices per teacher, matiere, niveau', icon: CashIcon },
    { href: 'admin.factures.index', label: 'Factures', description: 'Monthly payments and receipts', icon: CashIcon },
    { href: 'admin.sessions.index', label: 'Sessions', description: 'Mark presence, scan barcodes', icon: CalendarIcon },
];

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#123a63] to-[#2E86D8] p-6 text-white shadow-lg sm:p-8">
                    <p className="text-sm text-blue-100">Welcome back,</p>
                    <p className="mt-1 text-2xl font-semibold">{auth.user.name}</p>
                    <p className="mt-2 text-sm text-blue-100/90">Here's everything you can manage from one place.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {LINKS.map(({ href, label, description, icon: Icon }) => (
                        <Link
                            key={href}
                            href={route(href)}
                            className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3FC] text-[#1B4F8C] transition group-hover:bg-[#F5A623] group-hover:text-white">
                                <Icon className="h-5 w-5" />
                            </span>
                            <p className="mt-4 text-base font-semibold text-slate-800">{label}</p>
                            <p className="mt-1 text-sm text-slate-500">{description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
