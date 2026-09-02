<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Card - {{ $student->first_name }} {{ $student->last_name }}</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, Segoe UI, Roboto, sans-serif;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
        }
        /* Standard CR80 card-ish proportions, scaled up for readability/print */
        .card {
            width: 340px;
            border-radius: 16px;
            background: linear-gradient(135deg, #1f2937, #111827);
            color: #fff;
            padding: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .school-name {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #93c5fd;
        }
        .card-title {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 2px;
        }
        .content {
            display: flex;
            gap: 14px;
            margin-top: 16px;
        }
        .photo {
            width: 84px;
            height: 100px;
            border-radius: 8px;
            background: #374151;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: #9ca3af;
            overflow: hidden;
            flex-shrink: 0;
        }
        .photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info { flex: 1; }
        .name {
            font-size: 18px;
            font-weight: 700;
            line-height: 1.2;
        }
        .niveau {
            font-size: 13px;
            color: #d1d5db;
            margin-top: 4px;
        }
        .barcode-wrap {
            margin-top: 16px;
            background: #fff;
            border-radius: 8px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .barcode-wrap svg { width: 100%; height: auto; }
        .barcode-id {
            font-size: 10px;
            color: #6b7280;
            letter-spacing: 0.05em;
            margin-top: 2px;
        }
        .print-btn {
            margin-top: 20px;
            display: block;
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 8px;
            background: #1f2937;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
        @media print {
            body { background: #fff; padding: 0; }
            .print-btn { display: none; }
            .card { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div>
        <div class="card">
            <div class="school-name">Nasri School</div>
            <div class="card-title">Student ID</div>

            <div class="content">
                <div class="photo">
                    @if ($student->photoUrl())
                        <img src="{{ $student->photoUrl() }}" alt="Photo">
                    @else
                        No Photo
                    @endif
                </div>
                <div class="info">
                    <div class="name">{{ $student->first_name }}</div>
                    <div class="name">{{ $student->last_name }}</div>
                    <div class="niveau">{{ $student->niveau->label }}</div>
                </div>
            </div>

            <div class="barcode-wrap">
                <svg id="barcode"></svg>
                <div class="barcode-id">{{ $student->barcode }}</div>
            </div>
        </div>

        <button class="print-btn" onclick="window.print()">Print Card</button>
    </div>

    <script>
        JsBarcode("#barcode", @json($student->barcode), {
            format: "CODE128",
            displayValue: false,
            height: 50,
            margin: 0,
        });
    </script>
</body>
</html>
