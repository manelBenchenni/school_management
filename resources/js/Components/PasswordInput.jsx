import { forwardRef, useState } from 'react';
import TextInput from '@/Components/TextInput';
import { EyeIcon, EyeOffIcon } from '@/Components/Icons';

export default forwardRef(function PasswordInput({ className = '', ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <TextInput
                {...props}
                ref={ref}
                type={visible ? 'text' : 'password'}
                className={`pr-10 ${className}`}
            />
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
            >
                {visible ? (
                    <EyeOffIcon style={{ width: 18, height: 18 }} />
                ) : (
                    <EyeIcon style={{ width: 18, height: 18 }} />
                )}
            </button>
        </div>
    );
});
