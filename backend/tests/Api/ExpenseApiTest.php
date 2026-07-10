<?php

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExpenseApiTest extends WebTestCase
{

  public function testGetExpensesReturns200(): void
  {
    $client = static::createClient();
    $client->request('GET', '/api/expenses');

    $this->assertResponseStatusCodeSame(200);
    $data = json_decode($client->getResponse()->getContent(), true);
    $this->assertIsArray($data);
    $this->assertArrayHasKey('expenses', $data);
  }

  public function testPostExpenseCreatesExpense(): void
  {
    $client = static::createClient();

    $client->request(
      'POST',
      '/api/expenses/new',
      [],
      [],
      ['CONTENT_TYPE' => 'application/json'],
      json_encode([
        'amount'   => 900.00,
        'idUser'   => null,
        'idCategory' => null,
      ])
    );

    $this->assertResponseStatusCodeSame(201);
    $data = json_decode($client->getResponse()->getContent(), true);
    $this->assertArrayHasKey('id', $data);
    $this->assertEquals(900.00, $data['amount']);
  }

  public function testPostExpenseInvalidJsonReturns400(): void
  {
    $client = static::createClient();

    $client->request(
      'POST',
      '/api/expenses/new',
      [],
      [],
      ['CONTENT_TYPE' => 'application/json'],
      'invalid json'
    );

    $this->assertResponseStatusCodeSame(400);
  }

  public function testGetNonExistentExpenseReturns404(): void
  {
    $client = static::createClient();
    $client->request('GET', '/api/expenses/99999');
    $this->assertResponseStatusCodeSame(404);
  }
}
