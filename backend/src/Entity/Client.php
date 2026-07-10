<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client extends User
{
    #[ORM\Column]
    private ?float $account = null;

    #[ORM\OneToMany(targetEntity: Expense::class, mappedBy: 'idUser', cascade: ['persist', 'remove'])]
    private Collection $expenses;

    public function __construct()
    {
        $this->expenses = new ArrayCollection();
    }

    public function getAccount(): ?float
    {
        return $this->account;
    }

    public function setAccount(float $account): static
    {
        $this->account = $account;

        return $this;
    }

    public function getExpenses(): Collection
    {
        return $this->expenses;
    }

    public function addExpense(Expense $expense): static
    {
        if (!$this->expenses->contains($expense)) {
            $this->expenses->add($expense);
            $expense->setIdUser($this);
        }

        return $this;
    }

    public function removeExpense(Expense $expense): static
    {
        if ($this->expenses->removeElement($expense)) {
            if ($expense->getIdUser() === $this) {
                $expense->setIdUser(null);
            }
        }

        return $this;
    }
}
