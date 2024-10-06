<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TaskStatus;
// use BenSampo\Enum\Rules\Enum;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rule;
class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'employee_id' => 'required|exists:employees,id',
            'status' => ['required', Rule::in(['new', 'done', 'started'])]
            // 'status' => ['required', new Enum(TaskStatus::class)],
        ];
    }
}
