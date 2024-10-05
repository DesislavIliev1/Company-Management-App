<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'employee_id',
    ];
    protected $cast = [
        'status' => TaskStatus::class, 
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
