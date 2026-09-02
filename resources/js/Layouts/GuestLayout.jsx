import { Link } from '@inertiajs/react';
import { StarIcon } from '@/Components/Icons';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#123a63] via-[#1B5FA0] to-[#2E86D8] px-4 py-10">
            {/* ambient stars, echoing the logo mark */}
            <StarIcon className="absolute left-[8%] top-[14%] h-6 w-6 text-[#F5A623]/70" />
            <StarIcon className="absolute right-[12%] top-[22%] h-4 w-4 text-white/40" />
            <StarIcon className="absolute bottom-[18%] left-[16%] h-4 w-4 text-white/30" />
            <StarIcon className="absolute bottom-[10%] right-[10%] h-6 w-6 text-[#F5A623]/50" />

            <div className="relative w-full max-w-md">
                <Link href="/" className="mb-6 flex flex-col items-center gap-3">
                    <img src="/images/logo.png" alt="Es Senia School" className="h-20 w-20 rounded-2xl bg-white object-contain p-2 shadow-xl" />
                    <span className="text-lg font-semibold tracking-wide text-white">Es Senia School</span>
                </Link>

                <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-2xl shadow-black/20">
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-white/60">School management portal</p>
            </div>
        </div>
    );
}
