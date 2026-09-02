export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E86D8] to-[#3E9BE8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition duration-150 ease-in-out hover:from-[#2874BD] hover:to-[#2E86D8] focus:outline-none focus:ring-2 focus:ring-[#2E86D8] focus:ring-offset-2 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
