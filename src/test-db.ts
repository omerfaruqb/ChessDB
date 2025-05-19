import { initDatabase, closeDatabase } from './shared/db';
import { HallModel } from './domains/hall/models';

async function testDatabase() {
    try {
        // Initialize the database
        await initDatabase();
        const hallModel = new HallModel();

        console.log('=== Testing Hall Model ===');

        // Test create
        console.log('Creating a new hall...');
        const newHall = await hallModel.createHall({
            hall_name: 'Grand Chess Hall',
            country: 'Norway',
            capacity: 500
        });
        console.log('Created hall:', newHall);

        // Test get
        console.log('\nFetching the created hall...');
        const fetchedHall = await hallModel.getHall(newHall.hall_id);
        console.log('Fetched hall:', fetchedHall);

        // Test update
        console.log('\nUpdating the hall...');
        const updatedHall = await hallModel.updateHall(newHall.hall_id, {
            capacity: 600
        });
        console.log('Updated hall:', updatedHall);

        // Test get all
        console.log('\nFetching all halls...');
        const allHalls = await hallModel.getAllHalls();
        console.log('All halls:', allHalls);

        // Test delete
        console.log('\nDeleting the test hall...');
        await hallModel.deleteHall(newHall.hall_id);
        console.log('Hall deleted successfully');

        // Verify deletion
        const deletedHall = await hallModel.getHall(newHall.hall_id);
        console.log('Verify deletion (should be undefined):', deletedHall);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        // Close the database connection
        await closeDatabase();
    }
}

// Run the test
testDatabase().catch(console.error);
