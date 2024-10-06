<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Services\CompanyService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;
class CompanyController extends Controller
{
    protected $companyService;

    public function __construct(CompanyService $companyService)
    {
       $this->companyService = $companyService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = 10; // Default to 10 items per page
        $companies = $this->companyService->read($perPage);
        return response()->json(['companies' => $companies], 200);
    }

    
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $data['logo'] = Storage::url($path);
        }

        try {
            $company = $this->companyService->create($data);
            return response()->json(['company' => $company, 'message' => 'Company created successfully.'], 201);
        } catch (Exception $e) {
            Log::channel(channel: 'company')->info('Error creating company: ' . $e->getMessage());
            return response()->json(['error' => 'Error creating company.'], 500);
        }
    }

   

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, $id)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('public/logos');
            $data['logo'] = Storage::url($data['logo']);
        }

        try {
            $company = $this->companyService->edit($id, $data);
            return response()->json(['company' => $company, 'message' => 'Company updated successfully.'], 200);
        } catch (Exception $e) {
            Log::channel(channel: 'company')->info('Error updating company: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating company.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $this->companyService->delete($id);
            return response()->json(['message' => 'Company deleted successfully.'], 200);
        } catch (Exception $e) {
            Log::channel(channel: 'company')->info('Error deleting company: ' . $e->getMessage());
            return response()->json(['error' => 'Error deleting company.'], 500);
        }
    }
}
