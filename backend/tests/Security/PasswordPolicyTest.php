<?php

namespace App\Tests\Security;

use App\Security\PasswordPolicy;
use PHPUnit\Framework\TestCase;

class PasswordPolicyTest extends TestCase
{
    public function testRejectsTwoLetters(): void
    {
        $this->assertFalse(PasswordPolicy::isValid('ab'));
    }

    public function testRejectsLettersOnly(): void
    {
        $this->assertFalse(PasswordPolicy::isValid('password'));
    }

    public function testRejectsDigitsOnly(): void
    {
        $this->assertFalse(PasswordPolicy::isValid('12345678'));
    }

    public function testRejectsShortPassword(): void
    {
        $this->assertFalse(PasswordPolicy::isValid('ab12'));
    }

    public function testAcceptsValidPassword(): void
    {
        $this->assertTrue(PasswordPolicy::isValid('securepass1'));
    }
}
