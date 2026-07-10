<?php

namespace App\Controller;

use App\Entity\Expense;
use App\Form\ExpenseType;
use App\Repository\ExpenseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/expenses')]
final class ExpenseController extends AbstractController
{
    #[Route(name: 'expense_list', methods: ['GET'])]
    public function list(ExpenseRepository $expenseRepository): JsonResponse
    {
        $expenses = $expenseRepository->findAll();

        if (!$expenses) {
            return $this->json(['message' => 'No expenses   found'], 404);
        }

        $result = array_map(fn(Expense $e) => $this->expenseToArray($e), $expenses);

        return $this->json(['expenses' => $result]);
    }
    #[Route('/new', name: 'expense_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }
        $expense = new Expense();
        $expense->setDate(new \DateTime());
        $data['date'] = (new \DateTime())->format('Y-m-d');
        $form = $this->createForm(ExpenseType::class, $expense);
        $form->submit($data);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }

        $client = $expense->getIdUser();
        if ($client) {
            $currentAccount = $client->getAccount() ?? 0;
            $client->setAccount($currentAccount - abs($expense->getAmount()));
        }

        $em->persist($expense);
        $em->flush();

        return $this->json($this->expenseToArray($expense), 201);
    }

    #[Route('/{id}', name: 'expense_show', methods: ['GET'])]
    public function show(int $id, ExpenseRepository $expenseRepository): JsonResponse
    {
        $expense = $expenseRepository->find($id);

        if (!$expense) {
            return $this->json(['message' => 'Expense not found'], 404);
        }

        return $this->json($this->expenseToArray($expense));
    }


    #[Route('/{id}/edit', name: 'expense_update', methods: ['PUT', 'PATCH'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        Expense $expense
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }

        $form = $this->createForm(ExpenseType::class, $expense);
        $clearMissing = $request->getMethod() !== 'PATCH';
        $form->submit($data, $clearMissing);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }
        $entityManager->flush();

        return $this->json($this->expenseToArray($expense));
    }

    #[Route('/{id<\d+>}/delete', name: 'expense_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, Expense $expense): JsonResponse
    {
        $entityManager->remove($expense);
        $entityManager->flush();

        return $this->json(['message' => 'Expense deleted successfully'], 200);
    }
    private function expenseToArray(Expense $expense): array
    {
        return [
            'id' => $expense->getId(),
            'amount' => $expense->getAmount(),
            'date' => $expense->getDate()->format('d-m-Y'),
            'idUser' => $expense->getIdUser() ? $expense->getIdUser()->getId() : null,
            'idCategory' => $expense->getIdCategory() ? $expense->getIdCategory()->getId() : null,
        ];
    }
}
