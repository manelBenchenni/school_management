import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Reception Dashboard
                </h2>
            }
        >
            <Head title="Reception Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <p className="text-gray-700">
                            Welcome, {auth.user.name}. Registration, groupe
                            management, scheduling, and attendance scanning
                            will live here.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
