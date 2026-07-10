<?php

namespace App\Tests\Entity;

use App\Entity\Category;
use App\Entity\Expense;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
    public function testIdIsNullInitially(): void
    {
        $category = new Category();
        $this->assertNull($category->getId());
    }

    public function testSetAndGetName(): void
    {
        $category = new Category();
        $category->setName('Alimentation');
        $this->assertSame('Alimentation', $category->getName());
    }

    public function testExpensesCollectionIsEmptyInitially(): void
    {
        $category = new Category();
        $this->assertCount(0, $category->getExpenses());
    }

    public function testAddExpense(): void
    {
        $category = new Category();
        $expense = new Expense();
        $category->addExpense($expense);

        $this->assertCount(1, $category->getExpenses());
        $this->assertTrue($category->getExpenses()->contains($expense));
        $this->assertSame($category, $expense->getIdCategory());
    }

    public function testRemoveExpense(): void
    {
        $category = new Category();
        $expense = new Expense();
        $category->addExpense($expense);
        $category->removeExpense($expense);

        $this->assertCount(0, $category->getExpenses());
        $this->assertNull($expense->getIdCategory());
    }
}
