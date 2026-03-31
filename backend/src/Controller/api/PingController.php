<?php


namespace App\Controller\api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class PingController extends AbstractController

{
  #[Route('/api/health', name: 'api_health', methods: ['GET'])]
  public function __invoke(): JsonResponse
  {
    return new JsonResponse(['status' => 'ok']);
  }
}
