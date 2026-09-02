// Warm accent button (from the logo's gold), for the single "primary create" action per page.
export default function GoldButton({ className = '', href, as = 'link', children, ...props }) {
    const classes =
        'inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#F7B94D] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-900/10 transition duration-150 ease-in-out hover:from-[#E2960F] hover:to-[#F5A623] focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 ' +
        className;
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
