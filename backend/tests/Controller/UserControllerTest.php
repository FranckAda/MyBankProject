<?php

namespace App\Tests\Controller;

use App\Entity\Admin;
use App\Entity\Client;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class UserControllerTest extends WebTestCase
{
    private function authenticatedClient(Admin|Client $user): KernelBrowser
    {
        $client = static::createClient();
        // The api firewall is disabled in the test environment, so inject the
        // authenticated identity directly. In production it comes from the JWT.
        $client->getContainer()->get('security.token_storage')->setToken(
            new UsernamePasswordToken($user, 'api', $user->getRoles())
        );

        return $client;
    }

    private function adminUser(): Admin
    {
        $admin = new Admin();
        $admin->setMail('admin@test.local')
            ->setName('Admin')
            ->setLastname('Test')
            ->setPasswordHash('hash');

        return $admin;
    }

    private function clientUser(): Client
    {
        $client = new Client();
        $client->setMail('client@test.local')
            ->setName('Client')
            ->setLastname('Test')
            ->setPasswordHash('hash');

        return $client;
    }

    public function testListReturnsJson(): void
    {
        $client = $this->authenticatedClient($this->adminUser());
        $client->request('GET', '/api/users');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('users', $data);
    }

    public function testShowNonExistentReturns404(): void
    {
        $client = $this->authenticatedClient($this->adminUser());
        $client->request('GET', '/api/users/99999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testDeleteNonExistentReturns404(): void
    {
        $client = $this->authenticatedClient($this->adminUser());
        $client->request('DELETE', '/api/users/99999/delete');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testCreateWithInvalidJsonReturns400(): void
    {
        $client = $this->authenticatedClient($this->adminUser());
        $client->request('POST', '/api/users/new', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], 'invalid');
        $this->assertResponseStatusCodeSame(400);
    }

    public function testClientCannotListUsers(): void
    {
        $client = $this->authenticatedClient($this->clientUser());
        $client->request('GET', '/api/users');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testClientCannotDeleteUser(): void
    {
        // Use a real id: Doctrine resolves the entity before the security check.
        $client = $this->authenticatedClient($this->clientUser());
        $em = $client->getContainer()->get('doctrine')->getManager();
        $target = $this->clientUser();
        $target->setAccount(100);
        $em->persist($target);
        $em->flush();

        $client->request('DELETE', '/api/users/' . $target->getId() . '/delete');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testClientCannotCreateUser(): void
    {
        $client = $this->authenticatedClient($this->clientUser());
        $client->request('POST', '/api/users/new', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([]));
        $this->assertResponseStatusCodeSame(403);
    }

    public function testClientCannotShowAnotherUser(): void
    {
        $client = $this->authenticatedClient($this->clientUser());
        $client->request('GET', '/api/users/99999');
        $this->assertResponseStatusCodeSame(403);
    }
}
