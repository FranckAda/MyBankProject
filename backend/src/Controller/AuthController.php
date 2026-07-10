<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\Category;
use App\Entity\Client;
use App\Entity\Expense;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
final class AuthController extends AbstractController
{
    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Not authenticated'], 401);
        }
        $data = [
            'id' => $user->getId(),
            'mail' => $user->getMail(),
            'name' => $user->getName(),
            'lastname' => $user->getLastname(),
        ];
        $allCategories = $em->getRepository(Category::class)->findAll();
        $data['categories'] = array_map(fn($c) => [
            'id' => $c->getId(),
            'name' => $c->getName(),
        ], $allCategories);

        $data['role'] = $user instanceof Admin ? 'admin' : ($user instanceof Client ? 'client' : 'user');

        if ($user instanceof Client) {
            $data['account'] = $user->getAccount();

            $now = new \DateTime();
            $monthStart = (clone $now)->modify('first day of this month')->setTime(0, 0, 0);

            $monthExpenses = $em->getRepository(Expense::class)->createQueryBuilder('e')
                ->where('e.idUser = :user')
                ->andWhere('e.date >= :start')
                ->andWhere('e.date <= :end')
                ->setParameter('user', $user)
                ->setParameter('start', $monthStart)
                ->setParameter('end', $now)
                ->getQuery()
                ->getResult();

            $monthRevenue = 0;
            $monthSpending = 0;
            foreach ($monthExpenses as $expense) {
                $amount = $expense->getAmount();
                if ($amount > 0) {
                    $monthRevenue += $amount;
                } else {
                    $monthSpending += abs($amount);
                }
            }

            $data['monthRevenue'] = $monthRevenue;
            $data['monthSpending'] = $monthSpending;

            $allExpenses = $em->getRepository(Expense::class)->findBy(
                ['idUser' => $user],
                ['date' => 'DESC', 'id' => 'DESC']
            );

            $data['transactions'] = array_map(fn(Expense $e) => [
                'id' => $e->getId(),
                'amount' => $e->getAmount(),
                'date' => $e->getDate()->format('d-m-Y'),
                'idCategory' => $e->getIdCategory()?->getId(),
                'category' => $e->getIdCategory()?->getName() ?? '',
            ], $allExpenses);
        }

        return $this->json($data);
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON'], 400);
        }

        $mail = $data['mail'] ?? '';
        $password = $data['password'] ?? '';
        $name = $data['name'] ?? '';
        $lastname = $data['lastname'] ?? '';
        $role = strtolower($data['role'] ?? 'client');

        if (!in_array($role, ['admin', 'client'])) {
            return $this->json(['error' => 'Invalid role'], 400);
        }

        $existing = $em->getRepository(User::class)->findOneBy(['mail' => $mail]);
        if ($existing) {
            return $this->json(['error' => 'Email already registered'], 409);
        }

        $user = $role === 'admin' ? new Admin() : new Client();
        $user->setMail($mail);
        $user->setName($name);
        $user->setLastname($lastname);

        if ($user instanceof Client) {
            $user->setAccount(100);
        }

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], 422);
        }

        $user->setPasswordHash($passwordHasher->hashPassword($user, $password));

        $em->persist($user);
        $em->flush();

        return $this->json([
            'id' => $user->getId(),
            'mail' => $user->getMail(),
            'name' => $user->getName(),
            'lastname' => $user->getLastname(),
            'role' => $role,
        ], 201);
    }
}
