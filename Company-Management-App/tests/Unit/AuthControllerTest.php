<?php

namespace Tests\Unit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

use App\Models\User;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }
     /** @test */
     public function user_can_register()
     {
         $response = $this->postJson('/api/register', [
             'name' => 'John Doe',
             'email' => 'john@example.com',
             'password' => 'password',
             'password_confirmation' => 'password',
         ]);
 
         $response->assertStatus(201);
         $this->assertDatabaseHas('users', [
             'email' => 'john@example.com',
         ]);
     }

     /** @test */
    public function user_can_login()
    {
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['access_token', 'token_type']);
    }

     /** @test */
     public function user_can_logout()
     {
         $user = User::factory()->create();
         $token = $user->createToken('auth_token')->plainTextToken;
 
         $response = $this->withHeaders([
             'Authorization' => 'Bearer ' . $token,
         ])->postJson('/api/logout');
 
         $response->assertStatus(200);
         $response->assertJson(['message' => 'Logged out successfully']);
     }
}
