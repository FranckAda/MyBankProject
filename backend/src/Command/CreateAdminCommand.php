<?php

namespace App\Command;

use App\Entity\Admin;
use App\Entity\User;
use App\Security\PasswordPolicy;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Create an admin account without using public registration',
)]
final class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('mail', InputArgument::REQUIRED, 'Email of the admin')
            ->addOption(
                'password',
                null,
                InputOption::VALUE_OPTIONAL,
                'Password (hidden prompt is used when omitted)',
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $mail = strtolower(trim((string) $input->getArgument('mail')));
        if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
            $io->error(sprintf('"%s" is not a valid email address.', $mail));

            return Command::INVALID;
        }

        $password = $input->getOption('password');
        if (!is_string($password) || '' === $password) {
            $password = $io->askHidden('Password');
        }

        if (!is_string($password) || !PasswordPolicy::isValid($password)) {
            $io->error(PasswordPolicy::ERROR_MESSAGE);

            return Command::INVALID;
        }

        if ($this->entityManager->getRepository(User::class)->findOneBy(['mail' => $mail])) {
            $io->error(sprintf('A user with the mail "%s" already exists.', $mail));

            return Command::FAILURE;
        }

        $admin = new Admin();
        $admin->setMail($mail)
            ->setName('Admin')
            ->setLastname('Principal');
        $admin->setPasswordHash(
            $this->passwordHasher->hashPassword($admin, $password)
        );

        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        $io->success(sprintf('Admin "%s" created.', $mail));

        return Command::SUCCESS;
    }
}
