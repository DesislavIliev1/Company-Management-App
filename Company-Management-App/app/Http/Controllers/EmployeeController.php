<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use Exception;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{

    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
       $this->employeeService = $employeeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = 10; // Default to 10 items per page
        $employees = $this->employeeService->read($perPage);
        return response()->json(['companies' => $employees], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();
        try {
            $employee = $this->employeeService->create($data);
            return response()->json(['employee' => $employee, 'message' => 'Employee created successfully.'], 201);
        } catch (Exception $e) {
            Log::channel('employee')->info('Error creating employee: ' . $e->getMessage());
            return response()->json(['error' => 'Error creating employee.'], 500);
        }
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, $id)
    {
        $data = $request->validated();

        try {
            $employee = $this->employeeService->edit($id, $data);
            return response()->json(['employee' => $employee, 'message' => 'Employee updated successfully.'], 200);
        } catch (Exception $e) {
            Log::channel('employee')->info('Error updating employee: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating employee.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $this->employeeService->delete($id);
            return response()->json(['message' => 'Employee deleted successfully.'], 200);
        } catch (Exception $e) {
            Log::channel('employee')->info('Error deleting employee: ' . $e->getMessage());
            return response()->json(['error' => 'Error deleting employee.'], 500);
        }
    }
}
