<?php

namespace App\Controller;

use App\Entity\Expense;
use App\Repository\ExpenseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/expenses')]
class ExpenseController extends AbstractController
{
    // TEST 1 : GET /api/expenses → 200
    #[Route('', name: 'expense_index', methods: ['GET'])]
    public function index(ExpenseRepository $repo): JsonResponse
    {
        $expenses = $repo->findAll();
        return $this->json($expenses, 200);
    }

    // TEST 2 : POST /api/expenses → 201
    // TEST 3 : POST sans label → 422
    #[Route('', name: 'expense_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $expense = new Expense();
        $expense->setLabel($data['label'] ?? '');
        $expense->setAmount($data['amount'] ?? 0);
        $expense->setDate(new \DateTime($data['date'] ?? 'now'));
        $expense->setCategory($data['category'] ?? null);

        // Validation (NotBlank sur label)
        $errors = $validator->validate($expense);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], 422);
        }

        $em->persist($expense);
        $em->flush();

        return $this->json([
            'id'       => $expense->getId(),
            'label'    => $expense->getLabel(),
            'amount'   => $expense->getAmount(),
            'date'     => $expense->getDate()->format('Y-m-d'),
            'category' => $expense->getCategory(),
        ], 201);
    }

    // TEST 4 : GET /api/expenses/99999 → 404
    #[Route('/{id}', name: 'expense_show', methods: ['GET'])]
    public function show(int $id, ExpenseRepository $repo): JsonResponse
    {
        $expense = $repo->find($id);

        if (!$expense) {
            return $this->json(['message' => 'Expense not found'], 404);
        }

        return $this->json([
            'id'       => $expense->getId(),
            'label'    => $expense->getLabel(),
            'amount'   => $expense->getAmount(),
            'date'     => $expense->getDate()->format('Y-m-d'),
            'category' => $expense->getCategory(),
        ], 200);
    }
}
