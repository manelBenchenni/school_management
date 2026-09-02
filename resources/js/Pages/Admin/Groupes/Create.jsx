import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Card from '@/Components/Card';
import { Head, Link, useForm } from '@inertiajs/react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Create({ teachers, matieres, niveaux }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        teacher_id: '',
        matiere_id: '',
        niveau_id: '',
        schedules: [{ day_of_week: 1, start_time: '17:00', end_time: '18:30' }],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.groupes.store'));
    };

    const addSlot = () => {
        setData('schedules', [...data.schedules, { day_of_week: 1, start_time: '17:00', end_time: '18:30' }]);
    };

    const removeSlot = (index) => {
        setData('schedules', data.schedules.filter((_, i) => i !== index));
    };

    const updateSlot = (index, field, value) => {
        const next = [...data.schedules];
        next[index] = { ...next[index], [field]: value };
        setData('schedules', next);
    };

    // Selecting a teacher narrows the matiere dropdown to only what he
    // teaches, since a teacher can now teach several matieres.
    const onTeacherChange = (teacherId) => {
        const teacher = teachers.find((t) => String(t.id) === String(teacherId));
        setData((prev) => ({
            ...prev,
            teacher_id: teacherId,
            matiere_id: teacher && teacher.matiere_ids.length === 1 ? teacher.matiere_ids[0] : '',
        }));
    };

    const selectedTeacher = teachers.find((t) => String(t.id) === String(data.teacher_id));
    const availableMatieres = selectedTeacher
        ? matieres.filter((m) => selectedTeacher.matiere_ids.includes(m.id))
        : matieres;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold tracking-tight text-slate-800">Add Groupe</h2>}>
            <Head title="Add Groupe" />
            <div className="mx-auto max-w-xl">
                <Card>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Groupe name" />
                            <TextInput id="name" value={data.name} isFocused
                                placeholder="e.g. Maths 3AS - Groupe A" onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="teacher_id" value="Teacher" />
                            <SelectInput id="teacher_id" value={data.teacher_id} onChange={(e) => onTeacherChange(e.target.value)}>
                                <option value="">Select a teacher</option>
                                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </SelectInput>
                            <InputError message={errors.teacher_id} />
                        </div>

                        <div>
                            <InputLabel htmlFor="matiere_id" value="Matiere" />
                            <SelectInput id="matiere_id" value={data.matiere_id} onChange={(e) => setData('matiere_id', e.target.value)}>
                                <option value="">Select a matiere</option>
                                {availableMatieres.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </SelectInput>
                            <InputError message={errors.matiere_id} />
                        </div>

                        <div>
                            <InputLabel htmlFor="niveau_id" value="Niveau" />
                            <SelectInput id="niveau_id" value={data.niveau_id} onChange={(e) => setData('niveau_id', e.target.value)}>
                                <option value="">Select a niveau</option>
                                {niveaux.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
                            </SelectInput>
                            <InputError message={errors.niveau_id} />
                        </div>

                        <div>
                            <InputLabel value="Weekly schedule" />
                            <div className="mt-2 space-y-2">
                                {data.schedules.map((slot, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
                                        <SelectInput className="bg-white" value={slot.day_of_week}
                                            onChange={(e) => updateSlot(i, 'day_of_week', Number(e.target.value))}>
                                            {DAYS.map((d, idx) => <option key={idx} value={idx}>{d}</option>)}
                                        </SelectInput>
                                        <TextInput className="bg-white" type="time" value={slot.start_time}
                                            onChange={(e) => updateSlot(i, 'start_time', e.target.value)} />
                                        <span className="text-sm text-slate-400">to</span>
                                        <TextInput className="bg-white" type="time" value={slot.end_time}
                                            onChange={(e) => updateSlot(i, 'end_time', e.target.value)} />
                                        {data.schedules.length > 1 && (
                                            <button type="button" onClick={() => removeSlot(i)} className="shrink-0 text-sm font-medium text-rose-600 hover:text-rose-800">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addSlot} className="mt-3 text-sm font-medium text-[#2E86D8] hover:text-[#1B4F8C]">
                                + Add another slot
                            </button>
                            <InputError message={errors.schedules} />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                            <Link href={route('admin.groupes.index')}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
                            <PrimaryButton disabled={processing}>Create Groupe</PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
