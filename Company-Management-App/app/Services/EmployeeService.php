<?php

namespace App\Services;
use App\Models\Employee;

class EmployeeService
{
   
    /**
     * Create a new employee.
     *
     * @param array $data The data to create the employee with.
     * @return \App\Models\Employee The created employee.
     */
    public function create($data){
        
        $employee = Employee::create($data);
        return $employee;
    }

    /**
     * Read and paginate employees with their associated company and tasks.
     *
     * @param int $perPage The number of employees per page.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator The paginated employees.
     */
    public function read($perPage = 10){

        return Employee::with('company', 'tasks')->paginate($perPage);
    }

     /**
     * Edit an existing employee.
     *
     * @param int $id The ID of the employee to edit.
     * @param array $data The data to update the employee with.
     * @return \App\Models\Employee The updated employee.
     */
    public function edit($id, $data){
        
        $employee = Employee::findOrFail($id);
        $employee->update($data);
        return $employee;
           
    }
    
    /**
     * Delete an employee.
     *
     * @param int $id The ID of the employee to delete.
     * @return bool|null True if the employee was deleted, null otherwise.
     */
    public function delete($id){   
        $employee = Employee::findOrFail($id);
        return $employee->delete();
    }
}
