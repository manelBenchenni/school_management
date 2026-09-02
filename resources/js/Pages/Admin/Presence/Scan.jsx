import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
import axios from 'axios';

export default function Scan({ session, rolePrefix }) {
    const [barcode, setBarcode] = useState('');
    const [feedback, setFeedback] = useState(null);
    const inputRef = useRef(null);

    const submit = async (e) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        try {
            const res = await axios.post(route(`${rolePrefix}.presence.scan.store`, session.id), { barcode });
            setFeedback({ type: res.data.duplicate ? 'warn' : 'ok', ...res.data });
        } catch (err) {
            setFeedback({ type: 'error', error: err.response?.data?.error ?? 'Something went wrong.' });
        }

        setBarcode('');
        inputRef.current?.focus();
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Scan Presence</h2>}>
            <Head title="Scan Presence" />
            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <p className="text-sm text-gray-500">
                            {session.groupe.matiere.name} — {session.groupe.niveau.label} — {session.date} {session.start_time.slice(0, 5)}
                        </p>

                        <form onSubmit={submit} className="mt-6">
                            <input
                                ref={inputRef}
                                autoFocus
                                type="text"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Scan or type barcode..."
                                className="block w-full rounded-md border-gray-300 shadow-sm text-lg"
                            />
                        </form>

                        {feedback && (
                            <div className={`mt-6 rounded-md p-4 text-sm ${
                                feedback.type === 'ok' ? 'bg-green-50 text-green-700' :
                                feedback.type === 'warn' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-700'
                            }`}>
                                {feedback.type === 'error' ? feedback.error : (
                                    <>
                                        <p className="font-medium">{feedback.student}</p>
                                        {feedback.duplicate ? (
                                            <p>{feedback.message}</p>
                                        ) : (
                                            <p>Marked present. {feedback.sessions_remaining !== null ? `${feedback.sessions_remaining} sessions remaining.` : 'No active facture for this period.'}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}