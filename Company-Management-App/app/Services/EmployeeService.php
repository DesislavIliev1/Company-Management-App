<?php

namespace App\Services;
use App\Models\Employee;

class EmployeeService
{
   

    public function create($data){
        
        $employee = Employee::create($data);
        return $employee;
    }
    public function read($perPage = 10){
       
        $employees = Employee::select('first_name', 'email', 'phone')->paginate($perPage);
        return $employees;
    }


    public function edit($id, $data){
        
        $employee = Employee::findOrFail($id);
        $employee->update($data);
        return $employee;
           
    }

    public function delete($id){   
        $employee = Employee::findOrFail($id);
        return $employee->delete();
    }
}
