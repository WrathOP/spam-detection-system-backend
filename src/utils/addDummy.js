const { Client } = require('pg');
const { config } = require('dotenv');


// Database connection configuration

config();

const client = new Client({
    user: process.env.POSTGRES_USER, 
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    port: 5432,
});

async function seedDatabase() {
    try {
        await client.connect();

        // Begin transaction
        await client.query('BEGIN');

        // Insert data into users_table
        const userInsertQuery = `
      INSERT INTO users_table (username, password, name, phone_number, email)
      VALUES
        ('user1', 'password1', 'User One', 123456789, 'user1@example.com'),
        ('user2', 'password2', 'User Two', 987654321, 'user2@example.com')
      RETURNING id;
    `;
        const usersResult = await client.query(userInsertQuery);
        const [user1Id, user2Id] = usersResult.rows.map(row => row.id);

        // Insert data into contacts_table
        const contactInsertQuery = `
      INSERT INTO contacts_table (phone_number)
      VALUES
        (123456789),
        (987654321)
      RETURNING phone_number;
    `;
        const contactsResult = await client.query(contactInsertQuery);
        const [contact1Number, contact2Number] = contactsResult.rows.map(row => row.phone_number);

        // Insert data into contact_user_bridge
        const contactUserBridgeInsertQuery = `
      INSERT INTO contact_user_bridge (user_id, contact_phone_number, name)
      VALUES
        (${user1Id}, ${contact1Number}, 'Contact One for User 1'),
        (${user2Id}, ${contact2Number}, 'Contact Two for User 2');
    `;
        await client.query(contactUserBridgeInsertQuery);

        // Insert data into spam_reports
        const spamReportsInsertQuery = `
      INSERT INTO spam_reports (reported_by, contact_phone_number)
      VALUES
        (${user1Id}, ${contact1Number}),
        (${user2Id}, ${contact2Number});
    `;
        await client.query(spamReportsInsertQuery);

        // Commit transaction
        await client.query('COMMIT');

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
        await client.query('ROLLBACK');
    } finally {
        await client.end();
    }
}

seedDatabase();
