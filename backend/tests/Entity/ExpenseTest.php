<?php

namespace App\Tests\Entity;

use App\Entity\Expense;
use App\Entity\Client;
use App\Entity\Category;
use PHPUnit\Framework\TestCase;

class ExpenseTest extends TestCase
{
    public function testIdIsNullInitially(): void
    {
        $expense = new Expense();
        $this->assertNull($expense->getId());
    }

    public function testSetAndGetAmount(): void
    {
        $expense = new Expense();
        $expense->setAmount(150.75);
        $this->assertSame(150.75, $expense->getAmount());
    }

    public function testSetAndGetDate(): void
    {
        $expense = new Expense();
        $date = new \DateTime('2025-06-15');
        $expense->setDate($date);
        $this->assertSame($date, $expense->getDate());
    }

    public function testSetAndGetIdUser(): void
    {
        $expense = new Expense();
        $client = new Client();
        $expense->setIdUser($client);
        $this->assertSame($client, $expense->getIdUser());
    }

    public function testSetAndGetIdCategory(): void
    {
        $expense = new Expense();
        $category = new Category();
        $category->setName('Alimentation');
        $expense->setIdCategory($category);
        $this->assertSame($category, $expense->getIdCategory());
    }

    public function testSetIdCategoryToNull(): void
    {
        $expense = new Expense();
        $expense->setIdCategory(null);
        $this->assertNull($expense->getIdCategory());
    }
}
