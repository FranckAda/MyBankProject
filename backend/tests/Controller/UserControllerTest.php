<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
    public function testListReturnsJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/users');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('users', $data);
    }

    public function testShowNonExistentReturns404(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/users/99999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testDeleteNonExistentReturns404(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/users/99999/delete');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreateWithInvalidJsonReturns400(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/users/new', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], 'invalid');
        $this->assertResponseStatusCodeSame(400);
    }
}
