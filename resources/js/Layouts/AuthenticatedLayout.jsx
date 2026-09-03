import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    GroupIcon,
    BookIcon,
    LayersIcon,
    CashIcon,
    CalendarIcon,
    LogoutIcon,
    MenuIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClipboardIcon,
    WalletIcon,
} from '@/Components/Icons';

// Each role sees only its own list. Add to a role's array as you build
// more routes for it - same {href, label, icon} shape throughout.
const NAV_BY_ROLE = {
    admin: [
        { href: 'admin.dashboard', label: 'Home', icon: HomeIcon },
        { href: 'admin.users.index', label: 'Users', icon: UsersIcon },
        { href: 'admin.groupes.index', label: 'Groupes', icon: GroupIcon },
        { href: 'admin.matieres.index', label: 'Matieres', icon: BookIcon },
        { href: 'admin.niveaux.index', label: 'Niveaux', icon: LayersIcon },
        { href: 'admin.tarifs.index', label: 'Tarifs', icon: CashIcon },
        { href: 'admin.factures.index', label: 'Factures', icon: WalletIcon },
        { href: 'admin.sessions.index', label: 'Sessions', icon: CalendarIcon },
    ],
    reception: [
        { href: 'reception.dashboard', label: 'Home', icon: HomeIcon },
        // Add reception-specific routes here as they're built, e.g.:
        // { href: 'reception.sessions.index', label: 'Scan / Presence', icon: ClipboardIcon },
    ],
    teacher: [
        { href: 'teacher.dashboard', label: 'Home', icon: HomeIcon },
        // { href: 'teacher.groupes.index', label: 'My Groupes', icon: GroupIcon },
    ],
    parent: [
        { href: 'parent.dashboard', label: 'Home', icon: HomeIcon },
        // { href: 'parent.factures.index', label: 'Payments', icon: WalletIcon },
    ],
    student: [
        { href: 'student.dashboard', label: 'Home', icon: HomeIcon },
        // { href: 'student.attendance.index', label: 'My Attendance', icon: ClipboardIcon },
    ],
};

function isActive(href) {
    try {
        return route().current(href) || route().current(href.replace('.index', '.*'));
    } catch {
        return false;
    }
}

function SidebarContent({ nav, collapsed, onNavigate, onToggleCollapse }) {
    return (
        <div className="flex h-full flex-col bg-gradient-to-b from-[#123a63] to-[#0b2743] text-white">
            <div className={`flex flex-col items-center gap-2 border-b border-white/10 px-4 py-7 ${collapsed ? 'px-2' : 'px-6'}`}>
                <Link href={route(nav[0]?.href ?? '/')} onClick={onNavigate} className="flex flex-col items-center gap-2">
                    <img src="/images/logo.png" alt="Es Senia School" className="h-14 w-14 rounded-2xl bg-white/95 object-contain p-1.5 shadow-lg" />
                    {!collapsed && <span className="text-center text-sm font-semibold tracking-wide text-white">Es Senia School</span>}
                </Link>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                {nav.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={route(href)}
                            onClick={onNavigate}
                            title={collapsed ? label : undefined}
                            className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                                collapsed ? 'justify-center px-2' : ''
                            } ${
                                active
                                    ? 'bg-white/10 text-white shadow-inner ring-1 ring-inset ring-[#F5A623]/40'
                                    : 'text-blue-100/80 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                    active ? 'bg-[#F5A623] text-white' : 'bg-white/5 text-blue-200 group-hover:bg-white/10'
                                }`}
                            >
                                <Icon style={{ width: 18, height: 18 }} />
                            </span>
                            {!collapsed && label}
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop-only collapse toggle */}
            {onToggleCollapse && (
                <button
                    onClick={onToggleCollapse}
                    className="hidden items-center justify-center gap-2 border-t border-white/10 py-3 text-xs font-medium text-blue-100/70 hover:bg-white/5 hover:text-white lg:flex"
                >
                    {collapsed ? <ChevronRightIcon style={{ width: 16, height: 16 }} /> : (
                        <>
                            <ChevronLeftIcon style={{ width: 16, height: 16 }} />
                            Collapse
                        </>
                    )}
                </button>
            )}

            <div className="border-t border-white/10 p-3">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    title={collapsed ? 'Log out' : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-blue-100/80 transition hover:bg-white/5 hover:text-white ${
                        collapsed ? 'justify-center px-2' : ''
                    }`}
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shrink-0">
                        <LogoutIcon style={{ width: 18, height: 18 }} />
                    </span>
                    {!collapsed && 'Log out'}
                </Link>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const nav = NAV_BY_ROLE[auth.user.role] ?? [];

    // Persist the collapse preference across visits.
    useEffect(() => {
        const stored = window.localStorage.getItem('sidebar-collapsed');
        if (stored === '1') setCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        setCollapsed((prev) => {
            const next = !prev;
            window.localStorage.setItem('sidebar-collapsed', next ? '1' : '0');
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-[#F6F8FB]">
            {/* Desktop sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 hidden transition-all duration-200 lg:block ${collapsed ? 'w-20' : 'w-64'}`}>
                <SidebarContent nav={nav} collapsed={collapsed} onToggleCollapse={toggleCollapse} />
            </aside>

            {/* Mobile sidebar */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
                    <div className="absolute inset-y-0 left-0 w-64 shadow-xl">
                        <SidebarContent nav={nav} collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Top bar */}
                <div className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        >
                            <MenuIcon className="h-5 w-5" />
                        </button>
                        <Link
                            href={route(nav[0]?.href ?? '/')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#EAF3FC] px-3 py-1.5 text-sm font-semibold text-[#1B4F8C] transition hover:bg-[#DCEBFA]"
                        >
                            <HomeIcon className="h-4 w-4" />
                            Home
                        </Link>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2E86D8] to-[#1B4F8C] text-xs font-semibold text-white">
                                {auth.user.name?.charAt(0)?.toUpperCase()}
                            </span>
                            <span className="hidden sm:inline">{auth.user.name}</span>
                            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                        </button>
                        {userMenuOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                                >
                                    <LogoutIcon className="h-4 w-4" />
                                    Log out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {header && (
                    <div className="border-b border-slate-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">{header}</div>
                    </div>
                )}

                <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
