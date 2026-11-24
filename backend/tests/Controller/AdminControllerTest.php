<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AdminControllerTest extends WebTestCase
{
    public function testPublicRegisterCannotCreateAdmin(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'admin-test-' . uniqid() . '@test.com',
            'password' => 'password123',
            'name' => 'Admin',
            'lastname' => 'User',
            'role' => 'admin',
        ]));
        $this->assertResponseStatusCodeSame(403);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame(
            'Admin accounts cannot be created through public registration',
            $data['message'],
        );
    }

    public function testPublicRegisterCannotCreateAdminWithUppercaseRole(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'admin-upper-' . uniqid() . '@test.com',
            'password' => 'password123',
            'name' => 'Admin',
            'lastname' => 'User',
            'role' => 'ADMIN',
        ]));
        $this->assertResponseStatusCodeSame(403);
    }

    public function testRegisterWithAdminRoleDoesNotCreateUser(): void
    {
        $client = static::createClient();
        $mail = 'admin-ghost-' . uniqid() . '@test.com';

        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => $mail,
            'password' => 'password123',
            'name' => 'Admin',
            'lastname' => 'User',
            'role' => 'admin',
        ]));
        $this->assertResponseStatusCodeSame(403);

        // A second attempt with the same mail must not hit the "email already
        // registered" path: no user was created by the rejected request.
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => $mail,
            'password' => 'password123',
            'name' => 'Client',
            'lastname' => 'User',
            'role' => 'client',
        ]));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('client', $data['role']);
    }
}
