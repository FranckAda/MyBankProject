<?php

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExpenseApiTest extends WebTestCase
{

  public function testGetExpensesReturns404WhenEmpty(): void
  {
    $client = static::createClient();
    $client->request('GET', '/api/expenses');

    $this->assertResponseStatusCodeSame(404);
    $data = json_decode($client->getResponse()->getContent(), true);
    $this->assertArrayHasKey('message', $data);
    $this->assertSame('No expenses   found', $data['message']);
  }

  public function testPostExpenseWithNullUserReturns422(): void
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

    $this->assertResponseStatusCodeSame(422);
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
