<?php

namespace App\Enums;

enum TaskStatus : string
{
    case NEW = 'new';
    case STARTED = 'started';
    case DONE = 'done';
}