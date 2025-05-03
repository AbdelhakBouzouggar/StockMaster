<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\Response;

class VerifyExternalJwt
{
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token manquant ou mal formé'], 401);
        }

        $token = substr($authHeader, 7);

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            $jwtUser = json_decode(json_encode($decoded), true);

            // Vérifie qu'il contient bien une clé 'role' (ou adapte ici)
            if (!isset($jwtUser['role'])) {
                return response()->json(['error' => 'Le token ne contient pas d\'information de rôle.'], 403);
            }


            $request->merge(['jwt_user' => $jwtUser]);

            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalide : ' . $e->getMessage()], 401);
        }
    }
}