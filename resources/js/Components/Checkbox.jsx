export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-md border-slate-300 text-[#2E86D8] shadow-sm focus:ring-2 focus:ring-[#2E86D8]/30 ' + className
            }
        />
    );
}
