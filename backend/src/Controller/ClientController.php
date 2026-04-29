<?php

namespace App\Controller;

use App\Entity\Client;
use App\Form\ClientType;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/client', name: 'app_client_')]
final class ClientController extends AbstractController
{
    #[Route(name: '', methods: ['GET'])]
    public function index(ClientRepository $clientRepository): JsonResponse
    {
        if (!$clientRepository->findAll()) {
            return $this->json(['message' => 'No clients found'], 404);
        }

        return $this->json($clientRepository->findAll());
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $client = new Client();
        $form = $this->createForm(ClientType::class, $client);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($client);
            $entityManager->flush();

            return $this->json('Client created successfully');
        }

        return $this->json([
            'errors' => (string) $form->getErrors(true, false),
        ], 422);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, ClientRepository $clientRepository): JsonResponse
    {
        $client = $clientRepository->find($id);

        if (!$client) {
            return $this->json(['message' => 'Client not found'], 404);
        }
        return $this->json($client);
    }

    #[Route('/{id}/edit', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        Client $client,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }

        $form = $this->createForm(ClientType::class, $client);
        $clearMissing = $request->getMethod() !== 'PATCH';
        $form->submit($data, $clearMissing);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }



        $entityManager->flush();

        return $this->json($client);
    }
    #[Route('/{id}/delete', name: 'delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, Client $client): JsonResponse
    {
        $entityManager->remove($client);
        $entityManager->flush();

        return $this->json(['message' => 'Client deleted successfully'], 200);
    }
}
