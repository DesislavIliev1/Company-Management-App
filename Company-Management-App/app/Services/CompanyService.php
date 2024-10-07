<?php

namespace App\Services;
use App\Models\Company;

class CompanyService
{
    
    /**
     * Create a new company.
     *
     * @param array $data The data to create the company with.
     * @return \App\Models\Company The created company.
     */
    public function create($data){
        
        $company = Company::create($data);
        return $company;
    }

     /**
     * Read and paginate companies.
     *
     * @param int $perPage The number of companies per page.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator The paginated companies.
     */
    public function read($perPage = 10){
       
        $companies = Company::select('id','name','email', 'logo', 'website')->paginate($perPage);
        return $companies;
    }

    /**
     * Edit an existing company.
     *
     * @param int $id The ID of the company to edit.
     * @param array $data The data to update the company with.
     * @return \App\Models\Company The updated company.
     */
    public function edit($id, $data){
        
        $company = Company::findOrFail($id);
        $company->update($data);
        return $company;
           
    }

     /**
     * Delete a company.
     *
     * @param int $id The ID of the company to delete.
     * @return bool|null True if the company was deleted, null otherwise.
     */
    public function delete($id){   
        $company = Company::findOrFail($id);
        return $company->delete();
    }
}
