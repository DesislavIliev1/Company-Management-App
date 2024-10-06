<?php

namespace App\Services;
use App\Models\Task;
class TaskService
{
   
    public function create($data){
        
        $task = Task::create($data);
        return $task;
    }
    public function read($perPage = 10){
       
        $tasks = Task::select('name', 'description', 'status')->paginate($perPage);
        return $tasks;
    }


    public function edit($id, $data){
        
        $task = Task::findOrFail($id);
        $task->update($data);
        return $task;
           
    }

    public function delete($id){   
        $task = Task::findOrFail($id);
        return $task->delete();
    }
}
