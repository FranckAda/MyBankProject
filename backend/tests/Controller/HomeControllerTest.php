<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class HomeControllerTest extends WebTestCase
{
    public function testHomeReturnsStatus(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/home');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('MyBank API is running', $data['status']);
    }
}
