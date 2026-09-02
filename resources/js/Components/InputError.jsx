export default function InputError({ message, className = '', ...props }) {
    if (!message) return null;
    return (
        <p {...props} className={'mt-1.5 text-sm font-medium text-rose-600 ' + className}>
            {message}
        </p>
    );
}
