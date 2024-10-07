<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Services\TaskService;
use Exception;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    protected $taskService;

    /**
     * TaskController constructor.
     *
     * @param \App\Services\TaskService $taskService The service to handle task operations.
     */
    public function __construct(TaskService $taskService)
    {
       $this->taskService = $taskService;
    }

   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse The response containing the list of tasks.
     */
    public function index()
    {
        $perPage = 10; // Default to 10 items per page
        $tasks = $this->taskService->read($perPage);
        return response()->json(['tasks' => $tasks], 200);
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\Task\StoreTaskRequest $request The request containing the task data.
     * @return \Illuminate\Http\JsonResponse The response indicating the creation status.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        try {
            $task = $this->taskService->create($data);
            return response()->json(['task' => $task, 'message' => 'Task created successfully.'], 201);
        } catch (Exception $e) {
            Log::channel('task')->info('Error creating task: ' . $e->getMessage());
            return response()->json(['error' => 'Error creating task.'], 500);
        }
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\Task\UpdateTaskRequest $request The request containing the updated task data.
     * @param int $id The ID of the task to update.
     * @return \Illuminate\Http\JsonResponse The response indicating the update status.
     */
    public function update(UpdateTaskRequest $request, $id)
    {
        $data = $request->validated();

        try {
            $task = $this->taskService->edit($id, $data);
            return response()->json(['task' => $task, 'message' => 'Task updated successfully.'], 200);
        } catch (Exception $e) {
            Log::channel('task')->info('Error updating task: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating task.'], 500);
        }
    }

     /**
     * Remove the specified resource from storage.
     *
     * @param int $id The ID of the task to delete.
     * @return \Illuminate\Http\JsonResponse The response indicating the deletion status.
     */
    public function destroy($id)
    {
        try {
            $this->taskService->delete($id);
            return response()->json(['message' => 'Task deleted successfully.'], 200);
        } catch (Exception $e) {
            Log::channel('task')->info('Error deleting task: ' . $e->getMessage());
            return response()->json(['error' => 'Error deleting task.'], 500);
        }
    }
}
