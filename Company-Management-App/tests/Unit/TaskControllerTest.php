<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Company;
use App\Models\Employee;
use App\Models\Task;
use App\Models\User;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskControllerTest extends TestCase
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
        public function user_can_create_a_task()
        {
            $company = Company::factory()->create();
            $employee = Employee::factory()->create([
                'company_id' => $company->id,
            ]);
        
          $data = [
            'name' => 'Test',
            'description' => 'Test description',
            'employee_id' => $employee->id,
            'status' => 'done',
            // 'status' => TaskStatus::DONE,
          ];
  
          $response = $this->post('/api/task/create', $data);
  
          $response->assertStatus(201);  
          
          $this->assertDatabaseHas('tasks', [
              'name' => $data['name'],
              'description' => $data['description'],
              'employee_id' => $data['employee_id'],
              'status' => $data['status']
            //   'status' => TaskStatus::DONE,
            
            
          ]);
        }
    
        /** @test */
        public function user_can_update_a_task()
        {
            $company = Company::factory()->create();
            $employee = Employee::factory()->create([
                'company_id' => $company->id,
            ]);
            $task = Task::factory()->create([
                'employee_id' => $employee->id,
                'status' => 'new',
            ]);
            
            $newData = [
                'name' => 'New Test',
                'description' => 'New Test description',
                'employee_id' => $employee->id,
                'status' => 'started',
            ];
    
            $response = $this->put("/api/task/edit/{$task->id}", $newData);
    
            $response->assertStatus(200);
    
            $this->assertDatabaseHas('tasks', [
                'name' => $newData['name'],
                'description' => $newData['description'],
                'employee_id' => $newData['employee_id'],
                'status' => $newData['status'],
                
            ]);
        
        }
    
        /** @test */
        public function user_can_delete_a_task()
        {
            $company = Company::factory()->create();
            
            $employee = Employee::factory()->create([
            'company_id' => $company->id ]);

            $task = Task::factory()->create([
                'employee_id' => $employee->id,
            ]);
    
            $response = $this->delete("/api/task/delete/{$task->id}");

            $response->assertStatus(200);

            $this->assertDatabaseMissing('tasks', [
                'id' => $task->id,
            ]); 
        }
}