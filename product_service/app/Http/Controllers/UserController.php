<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'employe',
        ]);

        return response()->json([
            'message' => 'Employé créé avec succès.',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        if ($user->role !== 'employe') {
            return response()->json(['error' => 'Modification non autorisée.'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|string|min:8',
        ]);

        $user->update([
            'name' => $request->input('name', $user->name),
            'email' => $request->input('email', $user->email),
            'password' => $request->filled('password') ? Hash::make($request->password) : $user->password,
        ]);

        return response()->json([
            'message' => 'Employé mis à jour avec succès.',
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->role !== 'employe') {
            return response()->json(['error' => 'Suppression non autorisée.'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Employé supprimé avec succès.'
        ]);
    }
}
