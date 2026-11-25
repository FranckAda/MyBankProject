<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Seed the default expense categories through a migration so production does
 * not need doctrine:fixtures:load (which would also create the dev admin).
 */
final class Version20261125000000 extends AbstractMigration
{
    private const CATEGORIES = [
        'Alimentation',
        'Transport',
        'Logement',
        'Loisirs',
        'Santé',
        'Éducation',
        'Abonnements',
        'Épargne',
        'Habillement',
        'Voyages',
        'Restauration',
        'Sport',
    ];

    public function getDescription(): string
    {
        return 'Seed the default expense categories';
    }

    public function up(Schema $schema): void
    {
        foreach (self::CATEGORIES as $name) {
            $this->addSql(
                'INSERT INTO category (name) SELECT :new_name FROM DUAL
                 WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = :existing_name)',
                ['new_name' => $name, 'existing_name' => $name],
            );
        }
    }

    public function down(Schema $schema): void
    {
        $quoted = array_map(fn(string $name): string => $this->connection->quote($name), self::CATEGORIES);
        $this->addSql('DELETE FROM category WHERE name IN (' . implode(', ', $quoted) . ')');
    }
}
