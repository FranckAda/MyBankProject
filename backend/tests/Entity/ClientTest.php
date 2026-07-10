<?php

namespace App\Tests\Entity;

use App\Entity\Client;
use App\Entity\Expense;
use PHPUnit\Framework\TestCase;

class ClientTest extends TestCase
{
    public function testAccountDefaultIsNull(): void
    {
        $client = new Client();
        $this->assertNull($client->getAccount());
    }

    public function testSetAndGetAccount(): void
    {
        $client = new Client();
        $client->setAccount(1000.50);
        $this->assertSame(1000.50, $client->getAccount());
    }

    public function testExpensesCollectionIsEmptyInitially(): void
    {
        $client = new Client();
        $this->assertCount(0, $client->getExpenses());
    }

    public function testAddExpense(): void
    {
        $client = new Client();
        $expense = new Expense();
        $client->addExpense($expense);

        $this->assertCount(1, $client->getExpenses());
        $this->assertTrue($client->getExpenses()->contains($expense));
        $this->assertSame($client, $expense->getIdUser());
    }

    public function testRemoveExpense(): void
    {
        $client = new Client();
        $expense = new Expense();
        $client->addExpense($expense);
        $client->removeExpense($expense);

        $this->assertCount(0, $client->getExpenses());
        $this->assertNull($expense->getIdUser());
    }

    public function testAddExpenseDoesNotDuplicate(): void
    {
        $client = new Client();
        $expense = new Expense();
        $client->addExpense($expense);
        $client->addExpense($expense);

        $this->assertCount(1, $client->getExpenses());
    }
}
