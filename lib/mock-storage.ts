// Mock storage system using localStorage
class MockStorage {
    private prefix = 'diario-misional-mock-';

    // Generic CRUD operations
    async create(collection: string, data: any): Promise<{ id: string }> {
        const id = this.generateId();
        const item = { id, ...data, createdAt: new Date().toISOString() };

        const existing = this.getAll(collection);
        existing.push(item);
        this.save(collection, existing);

        console.log(`Mock: Created ${collection} item:`, item);
        return { id };
    }

    async read(collection: string, id?: string): Promise<any> {
        const items = this.getAll(collection);

        if (id) {
            const item = items.find(item => item.id === id);
            console.log(`Mock: Read ${collection} item:`, item);
            return item || null;
        }

        console.log(`Mock: Read all ${collection} items:`, items);
        return items;
    }

    async update(collection: string, id: string, data: any): Promise<void> {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
            this.save(collection, items);
            console.log(`Mock: Updated ${collection} item:`, items[index]);
        }
    }

    async delete(collection: string, id: string): Promise<void> {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== id);
        this.save(collection, filtered);
        console.log(`Mock: Deleted ${collection} item with id:`, id);
    }

    async query(collection: string, field: string, operator: string, value: any): Promise<any[]> {
        const items = this.getAll(collection);
        let filtered = items;

        switch (operator) {
            case '==':
                filtered = items.filter(item => item[field] === value);
                break;
            case '!=':
                filtered = items.filter(item => item[field] !== value);
                break;
            case '>':
                filtered = items.filter(item => item[field] > value);
                break;
            case '<':
                filtered = items.filter(item => item[field] < value);
                break;
            case '>=':
                filtered = items.filter(item => item[field] >= value);
                break;
            case '<=':
                filtered = items.filter(item => item[field] <= value);
                break;
            case 'array-contains':
                filtered = items.filter(item =>
                    Array.isArray(item[field]) && item[field].includes(value)
                );
                break;
        }

        console.log(`Mock: Query ${collection} where ${field} ${operator} ${value}:`, filtered);
        return filtered;
    }

    // Helper methods
    private getAll(collection: string): any[] {
        const key = this.prefix + collection;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    private save(collection: string, data: any[]): void {
        const key = this.prefix + collection;
        localStorage.setItem(key, JSON.stringify(data));
    }

    private generateId(): string {
        return 'mock-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    }

    // Initialize with sample data
    initializeSampleData(): void {
        // Sample diary entries
        const diaryEntries = this.getAll('diary');
        if (diaryEntries.length === 0) {
            this.create('diary', {
                content: 'Mi primer día en la misión. Estoy emocionado por esta nueva aventura.',
                date: new Date().toISOString(),
                type: 'spiritual',
                tags: ['primer-dia', 'emocion']
            });

            this.create('diary', {
                content: 'Hoy conocí a mi compañero Elder González. Es muy amable y trabajador.',
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                type: 'companion',
                tags: ['compañero', 'conocimiento']
            });
        }

        // Sample investigators
        const investigators = this.getAll('investigators');
        if (investigators.length === 0) {
            this.create('investigators', {
                name: 'Familia González',
                phone: '+1-555-0123',
                address: '123 Main St, Ciudad',
                status: 'teaching',
                progress: 'Lección 2',
                nextAppointment: '2024-10-01T19:00:00Z',
                notes: 'Muy interesados en aprender más sobre el Evangelio'
            });

            this.create('investigators', {
                name: 'Carlos Martínez',
                phone: '+1-555-0456',
                address: '456 Oak Ave, Ciudad',
                status: 'baptism-date',
                progress: 'Fecha de bautismo',
                nextAppointment: '2024-10-05T15:00:00Z',
                notes: 'Listo para el bautismo'
            });
        }

        // Sample schedule
        const schedule = this.getAll('schedule');
        if (schedule.length === 0) {
            this.create('schedule', {
                time: '09:00',
                activity: 'Estudio personal',
                description: 'Lectura de las Escrituras',
                status: 'completed',
                date: new Date().toISOString().split('T')[0]
            });

            this.create('schedule', {
                time: '10:00',
                activity: 'Reunión de distrito',
                description: 'Planificación semanal',
                status: 'pending',
                date: new Date().toISOString().split('T')[0]
            });

            this.create('schedule', {
                time: '14:00',
                activity: 'Enseñanza',
                description: 'Lección con Familia González',
                status: 'pending',
                date: new Date().toISOString().split('T')[0]
            });
        }

        console.log('Mock: Sample data initialized');
    }
}

export const mockStorage = new MockStorage();
