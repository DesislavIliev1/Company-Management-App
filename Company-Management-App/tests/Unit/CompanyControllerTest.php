<?php

namespace Tests\Unit;
use Tests\TestCase;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CompanyControllerTest extends TestCase
{
  use RefreshDatabase;

  protected function setUp(): void
  {
      parent::setUp();
      $this->user = User::factory()->create();
      $this->actingAs($this->user, 'sanctum');
  }
    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }

      /** @test */
      public function user_can_create_a_company()
      {
        Storage::fake('public');

        $data = [
            'name' => 'Test Post',
            'email' => 'email@abv.bg',
            'logo' => UploadedFile::fake()->image('logo.jpg', 100, 100),
            'website' => 'www.test.com'
        ];

        $response = $this->post('/api/companies/create', $data);

        $response->assertStatus(201);  
        
        $this->assertDatabaseHas('companies', [
            'name' => 'Test Post',
            'email' => 'email@abv.bg',
            'website' => 'www.test.com'
        ]);
      }
  
      /** @test */
      public function user_can_update_a_company()
      {
        Storage::fake('public');

        $company = Company::factory()->create([
          'name' => 'Old Name',
          'email' => 'old@example.com',
          'website' => 'https://old.com',
          'logo' => UploadedFile::fake()->image('logo.jpg', 100, 100),
        ]);
        
        $data = [
            'name' => 'Updated Company',
            'email' => 'updated@example.com',
            'logo' => UploadedFile::fake()->image('new-logo.jpg', 100, 100),
            'website' => 'https://updated.com',
        ];

        $response = $this->put("/api/companies/edit/{$company->id}", $data);

        $response->assertStatus(200);

        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'website' => $data['website']
        ]);
        // Storage::disk('public')->assertExists('logos/new-logo.jpg');
      }
  
      /** @test */
      public function user_can_delete_a_company()
      {
          $company = Company::factory()->create();
  
          $response = $this->delete("/api/companies/delete/{$company->id}");

          $response->assertStatus(200);

          $this->assertDatabaseMissing('companies', [
              'id' => $company->id,
          ]);
  
         
      }
}
