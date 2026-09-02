<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; }
        h2 { margin-bottom: 0; }
        .muted { color: #777; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        td { padding: 6px 0; border-bottom: 1px solid #eee; }
        .label { color: #777; }
        .value { text-align: right; }
        .total { font-weight: bold; font-size: 15px; }
    </style>
</head>
<body>
    <h2>Facture #{{ $facture->id }}</h2>
    <p class="muted">
        {{ $facture->enrollment->student->first_name }} {{ $facture->enrollment->student->last_name }}<br>
        {{ $facture->enrollment->groupe->matiere->name }} — {{ $facture->enrollment->groupe->niveau->label }} —
        {{ $facture->enrollment->groupe->teacher->first_name }} {{ $facture->enrollment->groupe->teacher->last_name }}
    </p>

    <table>
        <tr><td class="label">Month</td><td class="value">{{ \Illuminate\Support\Carbon::parse($facture->month)->format('F Y') }}</td></tr>
        <tr><td class="label">Status</td><td class="value">{{ ucfirst(str_replace('_', ' ', $facture->payment_status)) }}</td></tr>
        <tr><td class="label">Sessions paid</td><td class="value">{{ $facture->sessions_paid }}</td></tr>
        <tr><td class="label">Base amount</td><td class="value">{{ $facture->base_amount }} DA</td></tr>
        @if($facture->remise_percent)
            <tr><td class="label">Remise</td><td class="value">{{ $facture->remise_percent }}%</td></tr>
        @endif
        <tr class="total"><td>Amount due</td><td class="value">{{ $facture->amount_due }} DA</td></tr>
    </table>
</body>
</html>