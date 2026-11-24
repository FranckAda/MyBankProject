<?php

namespace App\DataFixtures;

use App\Entity\Admin;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Development-only admin account. Public registration can no longer create
 * admins, so fixtures bootstrap the first one.
 */
class AdminFixtures extends Fixture
{
    public const EMAIL = 'admin@mybank.local';
    public const PASSWORD = 'Admin1234';

    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $admin = new Admin();
        $admin->setMail(self::EMAIL)
            ->setName('Admin')
            ->setLastname('Principal');
        $admin->setPasswordHash(
            $this->passwordHasher->hashPassword($admin, self::PASSWORD)
        );

        $manager->persist($admin);
        $manager->flush();
    }
}
