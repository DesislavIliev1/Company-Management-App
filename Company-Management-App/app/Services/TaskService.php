<?php

namespace App\Services;
use App\Models\Task;
class TaskService
{
    /**
     * Create a new task.
     *
     * @param array $data The data to create the task with.
     * @return \App\Models\Task The created task.
     */
    public function create($data){
        
        $task = Task::create($data);
        return $task;
    }

    /**
     * Read and paginate tasks with their associated employee.
     *
     * @param int $perPage The number of tasks per page.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator The paginated tasks.
     */
    public function read($perPage = 10){
       
        return Task::with( 'employee')->paginate($perPage);
    }

    /**
     * Edit an existing task.
     *
     * @param int $id The ID of the task to edit.
     * @param array $data The data to update the task with.
     * @return \App\Models\Task The updated task.
     */
    public function edit($id, $data){
        
        $task = Task::findOrFail($id);
        $task->update($data);
        return $task;
           
    }

     /**
     * Delete a task.
     *
     * @param int $id The ID of the task to delete.
     * @return bool|null True if the task was deleted, null otherwise.
     */
    public function delete($id){   
        $task = Task::findOrFail($id);
        return $task->delete();
    }
}
