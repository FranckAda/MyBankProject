<?php

namespace App\Controller;

use App\Entity\Category;
use App\Form\CategoryType;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categories')]
final class CategoryController extends AbstractController
{
    #[Route(name: 'category_list', methods: ['GET'])]
    public function list(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findAll();

        if (!$categories) {
            return $this->json(['message' => 'No categories found'], 404);
        }

        $result = array_map(fn(Category $c) => $this->categoryToArray($c), $categories);

        return $this->json(['categories' => $result]);
    }
    #[Route('/new', name: 'category_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);
        $form->submit($data);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }

        $em->persist($category);
        $em->flush();

        return $this->json($this->categoryToArray($category), 201);
    }

    #[Route('/{id}', name: 'category_show', methods: ['GET'])]
    public function show(int $id, CategoryRepository $categoryRepository): JsonResponse
    {
        $category = $categoryRepository->find($id);

        if (!$category) {
            return $this->json(['message' => 'Category not found'], 404);
        }

        return $this->json($this->categoryToArray($category));
    }


    #[Route('/{id}/edit', name: 'category_update', methods: ['PUT', 'PATCH'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        Category $category
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], 400);
        }

        $form = $this->createForm(CategoryType::class, $category);
        $clearMissing = $request->getMethod() !== 'PATCH';
        $form->submit($data, $clearMissing);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => (string) $form->getErrors(true, false),
            ], 422);
        }
        $entityManager->flush();

        return $this->json($this->categoryToArray($category));
    }

    #[Route('/{id<\d+>}/delete', name: 'category_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, Category $category): JsonResponse
    {
        $entityManager->remove($category);
        $entityManager->flush();

        return $this->json(['message' => 'Category deleted successfully'], 200);
    }
    private function categoryToArray(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
        ];
    }
}
