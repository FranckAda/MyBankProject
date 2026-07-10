<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CategoryControllerTest extends WebTestCase
{
    public function testListReturnsJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/categories51');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('categories', $data);
    }

    public function testShowNonExistentReturns404(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/categories51/99999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreateWithInvalidJsonReturns400(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/categories51/new', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], 'invalid');
        $this->assertResponseStatusCodeSame(400);
    }

    public function testDeleteNonExistentReturns404(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/categories51/99999/delete');
        $this->assertResponseStatusCodeSame(404);
    }
}
