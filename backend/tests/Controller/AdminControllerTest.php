<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AdminControllerTest extends WebTestCase
{
    public function testAdminRegisterReturns201(): void
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
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertSame('admin', $data['role']);
    }

    public function testRegisterWithExistingEmailReturns409(): void
    {
        $client = static::createClient();
        $email = 'dupe-admin-' . uniqid() . '@test.com';
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => $email,
            'password' => 'password123',
            'name' => 'First',
            'lastname' => 'User',
            'role' => 'admin',
        ]));
        $this->assertResponseStatusCodeSame(201);

        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => $email,
            'password' => 'password123',
            'name' => 'Second',
            'lastname' => 'User',
            'role' => 'admin',
        ]));
        $this->assertResponseStatusCodeSame(409);
    }
}
