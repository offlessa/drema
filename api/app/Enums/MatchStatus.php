<?php

namespace App\Enums;

enum MatchStatus: string
{
    case Pending = 'pending';
    case Chatting = 'chatting';
    case Closed = 'closed';
}
