import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import FlashBanner from '@/Components/FlashBanner';
import { goldLinkClass, ghostLinkClass, dangerLinkClass, pillFilterClass } from '@/Components/linkStyles';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_LABELS = {
    admin: 'Admin',
    reception: 'Reception',
    teacher: 'Teacher',
    parent: 'Parent',
    student: 'Student',
};

function editRoute(user) {
    switch (user.role) {
        case 'student':
            return user.student ? route('admin.students.edit', user.student.id) : null;
        case 'teacher':
            return user.teacher ? route('admin.teachers.edit', user.teacher.id) : null;
        case 'parent':
            return user.parentProfile ? route('admin.parents.edit', user.parentProfile.id) : null;
        default:
            return route('admin.staff.edit', user.id);
    }
}

function subLabel(user) {
    if (user.role === 'student' && user.student?.niveau) {
        return user.student.niveau.label;
    }
    if (user.role === 'teacher' && user.teacher?.matieres?.length) {
        return `${user.teacher.matieres.map((m) => m.name).join(', ')} · ${user.teacher.percentage}%`;
    }
    return null;
}

export default function Index({ users, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.q || '');

    const applyFilters = (next) => {
        router.get(route('admin.users.index'), { ...filters, ...next }, {
            preserveState: true,
            replace: true,
        });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilters({ q: search });
    };

    const destroy = (user) => {
        if (!confirm(`Remove ${user.name}? This can't be undone.`)) return;
        router.delete(route('admin.users.destroy', user.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">User Management</h2>}
        >
            <Head title="Users" />

            <div className="mx-auto max-w-7xl">
                <FlashBanner success={flash?.success} error={flash?.error} />

                <Card padded={false}>
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={submitSearch} className="flex gap-2">
                            <TextInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, email, phone..."
                                className="w-64"
                            />
                            <PrimaryButton type="submit">Search</PrimaryButton>
                        </form>

                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => applyFilters({ role: '' })} className={pillFilterClass(!filters.role)}>
                                All
                            </button>
                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => applyFilters({ role: value })}
                                    className={pillFilterClass(filters.role === value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link href={route('admin.students.create')} className={goldLinkClass}>+ Student</Link>
                            <Link href={route('admin.teachers.create')} className={goldLinkClass}>+ Teacher</Link>
                            <Link href={route('admin.parents.create')} className={goldLinkClass}>+ Parent</Link>
                            <Link href={route('admin.staff.create')} className={goldLinkClass}>+ Staff</Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Details</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-slate-50/60">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{user.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{ROLE_LABELS[user.role]}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{user.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{user.phone || '—'}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{subLabel(user) || '—'}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <div className="flex items-center justify-end gap-4">
                                                {user.role === 'student' && user.student && (
                                                    <>
                                                        <Link href={route('admin.students.enroll', user.student.id)} className={ghostLinkClass}>
                                                            Groupes
                                                        </Link>
                                                        <a href={route('admin.students.card', user.student.id)} target="_blank" rel="noopener noreferrer" className={ghostLinkClass}>
                                                            Card
                                                        </a>
                                                    </>
                                                )}
                                                {editRoute(user) && (
                                                    <Link href={editRoute(user)} className={ghostLinkClass}>
                                                        Edit
                                                    </Link>
                                                )}
                                                <button onClick={() => destroy(user)} className={dangerLinkClass}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {users.links && (
                        <div className="flex flex-wrap gap-1 border-t border-slate-100 p-4">
                            {users.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-3 py-1 text-sm ${
                                        link.active ? 'bg-[#1B4F8C] text-white' : 'text-slate-500 hover:bg-slate-100'
                                    } ${!link.url && 'pointer-events-none opacity-50'}`}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
