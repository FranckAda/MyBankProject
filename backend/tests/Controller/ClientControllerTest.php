<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ClientControllerTest extends WebTestCase
{
    public function testClientRegisterReturns201(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'client-test-' . uniqid() . '@test.com',
            'password' => 'password123',
            'name' => 'Client',
            'lastname' => 'User',
            'role' => 'client',
        ]));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertSame('client', $data['role']);
    }

    public function testRegisterWithInvalidRoleReturns400(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'bad-role@test.com',
            'password' => 'password123',
            'name' => 'Bad',
            'lastname' => 'Role',
            'role' => 'superadmin',
        ]));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testRegisterWithMissingFieldsReturns201(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'mail' => 'empty-' . uniqid() . '@test.com',
            'password' => 'password123',
            'name' => '',
            'lastname' => '',
            'role' => 'client',
        ]));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
    }

    public function testRegisterWithInvalidJsonReturns400(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], 'not-json');
        $this->assertResponseStatusCodeSame(400);
    }
}
