<?php

namespace App\Tests\Entity;

use App\Entity\Admin;
use App\Entity\Client;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testIdIsNullInitially(): void
    {
        $user = new User();
        $this->assertNull($user->getId());
    }

    public function testSetAndGetMail(): void
    {
        $user = new User();
        $user->setMail('user@test.com');
        $this->assertSame('user@test.com', $user->getMail());
    }

    public function testSetAndGetName(): void
    {
        $user = new User();
        $user->setName('John');
        $this->assertSame('John', $user->getName());
    }

    public function testSetAndGetLastname(): void
    {
        $user = new User();
        $user->setLastname('Doe');
        $this->assertSame('Doe', $user->getLastname());
    }

    public function testSetAndGetPasswordHash(): void
    {
        $user = new User();
        $user->setPasswordHash('hashed_password');
        $this->assertSame('hashed_password', $user->getPasswordHash());
    }

    public function testSetPasswordUpdatesPasswordHash(): void
    {
        $user = new User();
        $user->setPassword('hashed_via_setter');
        $this->assertSame('hashed_via_setter', $user->getPassword());
    }

    public function testGetUserIdentifierReturnsMail(): void
    {
        $user = new User();
        $user->setMail('john@test.com');
        $this->assertSame('john@test.com', $user->getUserIdentifier());
    }

    public function testDefaultRoleIsUser(): void
    {
        $user = new User();
        $this->assertContains('ROLE_USER', $user->getRoles());
        $this->assertNotContains('ROLE_ADMIN', $user->getRoles());
    }

    public function testAdminHasAdminRole(): void
    {
        $admin = new Admin();
        $this->assertContains('ROLE_USER', $admin->getRoles());
        $this->assertContains('ROLE_ADMIN', $admin->getRoles());
    }

    public function testClientHasOnlyUserRole(): void
    {
        $client = new Client();
        $this->assertContains('ROLE_USER', $client->getRoles());
        $this->assertNotContains('ROLE_ADMIN', $client->getRoles());
    }
}
