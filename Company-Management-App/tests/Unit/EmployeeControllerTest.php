<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Company;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EmployeeControllerTest extends TestCase
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
        public function user_can_create_a_employee()
        {
            $company = Company::factory()->create();
        
          $data = [
              'first_name' => 'Mark',
              'last_name' => 'Tom',
              'company_id' => $company->id,
              'email' => 'email@abv.bg',
              'phone' => '1234567890',
          ];
  
          $response = $this->post('/api/employees/create', $data);
  
          $response->assertStatus(201);  
          
          $this->assertDatabaseHas('employees', [
              'first_name' => $data['first_name'],
              'last_name' => $data['last_name'],
              'company_id' => $data['company_id'],
              'email' => $data['email'],
              'phone' => $data['phone'],
          ]);
        }
    
        /** @test */
        public function user_can_update_a_employee()
        {
          $company = Company::factory()->create();
          $employee = Employee::factory()->create([
            'first_name' => 'Mark',
            'last_name' => 'Tom',
            'company_id' => $company->id,
            'email' => 'email@abv.bg',
            'phone' => '1234567890',
          ]);
          
          $newData = [
            'first_name' => 'Updated Mark',
            'last_name' => 'Updated Tom',
            'company_id' => $company->id,
            'email' => 'newemail@abv.bg',
            'phone' => '09877432123',
          ];
  
          $response = $this->put("/api/employees/edit/{$employee->id}", $newData);
  
          $response->assertStatus(200);
  
          $this->assertDatabaseHas('employees', [
              'first_name' => $newData['first_name'],
              'last_name' => $newData['last_name'],
              'company_id' => $newData['company_id'],
              'email' => $newData['email'],
              'phone' => $newData['phone'],
          ]);
        
        }
    
        /** @test */
        public function user_can_delete_an_employee()
        {
            $company = Company::factory()->create();
            $employee = Employee::factory()->create([
               'first_name' => 'Mark',
                'last_name' => 'Tom',
                'company_id' => $company->id,
                'email' => 'email@abv.bg',
                'phone' => '1234567890',
            ]);
    
            $response = $this->delete("/api/employees/delete/{$employee->id}");
  
            $response->assertStatus(200);
  
            $this->assertDatabaseMissing('employees', [
                'id' => $employee->id,
            ]);
    
           
        }
}
