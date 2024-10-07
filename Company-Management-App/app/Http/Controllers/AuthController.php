<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
     /**
     * Register a new user.
     *
     * @param \App\Http\Requests\RegisterRequest $request The request containing the registration data.
     * @return \Illuminate\Http\JsonResponse The response indicating the registration status.
     */
    public function register(RegisterRequest $request)
    {
        $request->validated();

        User::create([
            'name' => $request->validated()['name'],
            'email' => $request->validated()['email'],
            'password' => Hash::make($request->validated()['password']),
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }

     /**
     * Log in a user and issue an access token.
     *
     * @param \App\Http\Requests\LoginRequest $request The request containing the login data.
     * @return \Illuminate\Http\JsonResponse The response containing the access token.
     * @throws \Illuminate\Validation\ValidationException If the provided credentials are incorrect.
     */
    public function login(LoginRequest $request)
    {
        $request->validated();

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer']);
    }

    /**
     * Log out the authenticated user.
     *
     * @param \Illuminate\Http\Request $request The request containing the logout data.
     * @return \Illuminate\Http\JsonResponse The response indicating the logout status.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Verify if the user is authenticated.
     *
     * @param \Illuminate\Http\Request $request The request containing the verification data.
     * @return \Illuminate\Http\JsonResponse The response indicating the authentication status.
     */
    public function verify(Request $request)
    {
        try {
            $user = Auth::guard('sanctum')->user();
            if ($user) {
                return response()->json(['isAuthenticated' => true], 200);
            } else {
                return response()->json(['isAuthenticated' => false], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error'], 500);
        }
    }
}