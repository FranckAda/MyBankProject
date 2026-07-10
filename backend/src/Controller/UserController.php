<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\Client;
use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users')]
final class UserController extends AbstractController
{
    #[Route(name: 'user_list', methods: ['GET'])]
    public function list(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        if (!$users) {
            return $this->json(['message' => 'No users found'], 404);
        }

        $result = array_map(fn(User $u) => $this->userToArray($u), $users);

        return $this->json(['users' => $result]);
    }

    #[Route('/{id}', name: 'user_show', methods: ['GET'])]
    public function show(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        return $this->json($this->userToArray($user));
    }

    #[Route('/new', name: 'user_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }

        $user = new User();

        $form = $this->createForm(UserType::class, $user);
        $form->submit($data);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }

        $plainPassword = $this->generatePassword();
        $user->setPasswordHash(
            $passwordHasher->hashPassword($user, $plainPassword)
        );
        if (isset($data['role'])) {
            $role = strtolower($data['role']);
            if ($role === 'admin') {
                $user = new Admin();
            } elseif ($role === 'client') {
                $user = new Client();
                $user->setAccount(100); // Initialize account balance for Client
            } else {
                return $this->json(['error' => 'Invalid role specified'], 400);
            }
        }
        $em->persist($user);
        $em->flush();

        return $this->json($this->userToArray($user), 201);
    }



    #[Route('/{id}/edit', name: 'user_update', methods: ['PUT', 'PATCH'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        User $user,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }

        $form = $this->createForm(UserType::class, $user);
        $clearMissing = $request->getMethod() !== 'PATCH';
        $form->submit($data, $clearMissing);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }

        if (!empty($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPasswordHash($hashedPassword);
        }

        $entityManager->flush();

        return $this->json($this->userToArray($user));
    }

    #[Route('/{id<\d+>}/delete', name: 'user_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, User $user): JsonResponse
    {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'User deleted successfully'], 200);
    }

    private function generatePassword(int $length = 14): string
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        $charactersLength = strlen($characters);
        $randomPassword = '';

        for ($i = 0; $i < $length; $i++) {
            $randomPassword .= $characters[random_int(0, $charactersLength - 1)];
        }

        return $randomPassword;
    }
    private function userToArray(User $user): array
    {
        return [
            'id' => $user->getId(),
            'mail' => $user->getMail(),
            'name' => $user->getName(),
            'lastname' => $user->getLastname(),
            'role' => $user instanceof Admin ? 'admin' : ($user instanceof Client ? 'client' : 'user'),
        ];
    }
}
