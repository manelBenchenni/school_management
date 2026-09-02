import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref
) {
    const localRef = useRef(null);
    const input = ref ? ref : localRef;

    useEffect(() => {
        if (isFocused) input.current?.focus();
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'block w-full rounded-xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-[#2E86D8] focus:ring-2 focus:ring-[#2E86D8]/30 ' +
                className
            }
            ref={input}
        />
    );
});
