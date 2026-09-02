import { forwardRef } from 'react';

export default forwardRef(function SelectInput({ className = '', children, ...props }, ref) {
    return (
        <select
            {...props}
            ref={ref}
            className={
                'block w-full rounded-xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm transition focus:border-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30 ' +
                className
            }
        >
            {children}
        </select>
    );
});
