<?php

namespace App\Security;

/**
 * Regles de mot de passe partagees avec le frontend (src/lib/password.js).
 * Verifiees cote serveur pour ne pas pouvoir etre contournees via l'API.
 */
final class PasswordPolicy
{
    public const MIN_LENGTH = 8;
    public const ERROR_MESSAGE = 'Password must be at least 8 characters and contain a letter and a number.';

    public static function isValid(string $password): bool
    {
        return strlen($password) >= self::MIN_LENGTH
            && preg_match('/\p{L}/u', $password) === 1
            && preg_match('/\d/', $password) === 1;
    }
}
