<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Usage in routes: ->middleware('role:admin') or ->middleware('role:admin,reception')
// Register the alias in bootstrap/app.php - see routes/web.php notes.
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, "You don't have access to this page.");
        }

        return $next($request);
    }
}
