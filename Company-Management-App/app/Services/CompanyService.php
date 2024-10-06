<?php

namespace App\Services;
use App\Models\Company;

class CompanyService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create($data){
        
        $company = Company::create($data);
        return $company;
    }
    public function read($perPage = 10){
       
        $companies = Company::select('id','name','email', 'logo', 'website')->paginate($perPage);
        return $companies;
    }


    public function edit($id, $data){
        
        $company = Company::findOrFail($id);
        $company->update($data);
        return $company;
           
    }

    public function delete($id){   
        $company = Company::findOrFail($id);
        return $company->delete();
    }
}
