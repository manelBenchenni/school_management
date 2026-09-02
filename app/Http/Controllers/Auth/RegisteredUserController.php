<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use App\Services\OtpService;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            // Exactly 10 numeric digits — Laravel's built-in "digits" rule
            // rejects anything shorter/longer or containing non-digit chars.
            'phone'     => ['required', 'digits:10'],
            'password'  => ['required', 'confirmed', Password::defaults()],
            // 'role' comes from the app (a toggle: client / cuisiniere / livreur)
            'role'      => ['required', Rule::in(['client', 'cuisiniere', 'livreur'])],
            // Optional — sent for every role the same way the login endpoint
            // receives it, so a livreur (or any role) gets a location saved
            // right from signup instead of waiting for a first login.
            'latitude'  => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            ...($request->filled('latitude') && $request->filled('longitude')
                ? [
                    'latitude'  => $request->input('latitude'),
                    'longitude' => $request->input('longitude'),
                  ]
                : []),
        ]);

        // Send the email verification code. The account exists but is
        // NOT usable yet — enforcement happens via the 'verified.email'
        // middleware on protected routes (see routes/api.php), not here.
        $code = app(OtpService::class)->generate($user->email, 'email_verification');
        Mail::to($user->email)->send(new OtpMail($code, 'email_verification'));

        event(new Registered($user));

        // We still issue a token so the (unverified) user can call
        // /email/send-otp and /email/verify — those two endpoints are
        // the only ones this token should be usable for until the email
        // is verified. Every other protected route is gated behind
        // 'verified.email' in routes/api.php.
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
            'role'  => $user->role,
        ], 201);
    }
}