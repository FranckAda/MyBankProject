<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
  #[Route('/home', name: 'home', methods: ['GET'])]
  public function index(): JsonResponse
  {
    return new JsonResponse(['status' => 'MyBank API is running']);
  }
}
