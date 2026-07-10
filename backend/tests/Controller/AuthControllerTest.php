<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    public function testMeWithoutAuthReturns401(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/me');
        $this->assertResponseStatusCodeSame(401);
    }

    public function testLoginWithInvalidCredentialsReturns401(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/login_check', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'nonexistent@test.com',
            'password' => 'wrong',
        ]));
        $this->assertResponseStatusCodeSame(401);
    }

    public function testRegisterCreatesUser(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'new-user-' . uniqid() . '@test.com',
            'password' => 'securepass',
            'name' => 'Test',
            'lastname' => 'User',
            'role' => 'client',
        ]));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertSame('client', $data['role']);
    }
}
