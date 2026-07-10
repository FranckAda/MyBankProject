<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExpenseControllerTest extends WebTestCase
{
    public function testListReturns404WhenEmpty(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses');
        $this->assertResponseStatusCodeSame(404);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('message', $data);
    }

    public function testCreateWithNonExistentEntitiesReturns422(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/expenses/new', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'amount' => 50,
            'idUser' => 1,
            'idCategory' => 13,
        ]));
        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateWithInvalidJsonReturns400(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/expenses/new', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], 'not-json');
        $this->assertResponseStatusCodeSame(400);
    }

    public function testShowNonExistentReturns404(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses/99999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testDeleteNonExistentReturns404(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/expenses/99999/delete');
        $this->assertResponseStatusCodeSame(404);
    }
}
